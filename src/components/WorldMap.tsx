import { useMemo, useState, useEffect, useRef } from 'react';
import type { Country } from '@/hooks/useGameState';
import { GeoBackdrop } from '@/components/GeoBackdrop';

interface WorldMapProps {
  countries: Country[];
  onAllocateDoctor: (countryId: string) => void;
  onRecallDoctor: (countryId: string) => void;
  availableDoctors: number;
}

export const WorldMap = ({ countries, onAllocateDoctor, onRecallDoctor, availableDoctors }: WorldMapProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (selectedCountry) {
      const updatedCountry = countries.find(c => c.id === selectedCountry.id);
      if (updatedCountry) {
        setSelectedCountry(updatedCountry);
      }
    }
  }, [countries, selectedCountry]);

  const getInfectionIntensity = (level: number, importance: number) => {
    // Base infection color based on level
    let baseClass = "";
    if (level < 20) baseClass = "bg-secondary border-muted";
    else if (level < 40) baseClass = "bg-infection-low border-infection-low";
    else if (level < 65) baseClass = "bg-infection-medium border-infection-medium";
    else baseClass = "bg-infection-critical border-infection-critical infection-glow";
    
    // Add size modifier based on country importance - more dramatic scaling
    const sizeClass = importance > 85 ? "scale-140" : 
                     importance > 70 ? "scale-125" : 
                     importance > 50 ? "scale-110" : 
                     importance < 30 ? "scale-75" :
                     importance < 50 ? "scale-90" : "";
    
    // Add pulsing effect for very high infection levels
    const pulseClass = level > 75 ? "animate-pulse" : "";
    
    return `${baseClass} ${sizeClass} ${pulseClass}`;
  };

  // Size/animation modifiers without background to avoid square red boxes
  const getDotModifiers = (level: number, importance: number) => {
    const pulseClass = level > 75 ? "animate-pulse" : "";
    return `${pulseClass}`.trim();
  };

  // Importance-based size applied on the outer wrapper so hover/near on inner always scales up
  const getImportanceScaleClass = (importance: number) => {
    return importance > 85 ? "scale-140" :
           importance > 70 ? "scale-125" :
           importance > 50 ? "scale-110" :
           importance < 30 ? "scale-75" :
           importance < 50 ? "scale-90" : "";
  };

  const getBgClass = (level: number) => {
    if (level < 20) return "bg-secondary";
    if (level < 40) return "bg-infection-low";
    if (level < 65) return "bg-infection-medium";
    return "bg-infection-critical";
  };

  const getBorderClass = (level: number) => {
    if (level < 20) return "border-muted";
    if (level < 40) return "border-infection-low";
    if (level < 65) return "border-infection-medium";
    return "border-infection-critical";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const isNear = (country: Country) => {
    if (!mousePos || !containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = (country.x / 100) * rect.width;
    const cy = (country.y / 100) * rect.height;
    const dx = mousePos.x - cx;
    const dy = mousePos.y - cy;
    const dist = Math.hypot(dx, dy);
    // Consider "near" within ~48px (slightly larger than the dot), tweakable
    return dist < 48;
  };

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
  };

  // Map our countries to optional jsvectormap markers (lat, lng)
  // Note: We keep the existing x/y percent positioning for game dots; markers are only for context.
  const markers = useMemo(() => {
    const countryToLatLng: Record<string, [number, number]> = {
      usa: [37.0902, -95.7129],
      china: [35.8617, 104.1954],
      india: [20.5937, 78.9629],
      brazil: [-14.2350, -51.9253],
      italy: [41.8719, 12.5674],
      germany: [51.1657, 10.4515],
      france: [46.2276, 2.2137],
      uk: [55.3781, -3.4360],
      japan: [36.2048, 138.2529],
      australia: [-25.2744, 133.7751],
    };

    return countries
      .map(c => ({
        name: c.name as string,
        coords: countryToLatLng[c.id] as [number, number] | undefined,
      }))
      .filter((m): m is { name: string; coords: [number, number] } => Array.isArray(m.coords));
  }, [countries]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full bg-gradient-dark overflow-hidden"
    >
      {/* Geographic backdrop with pan/zoom. Sits behind all gameplay UI. */}
      <GeoBackdrop
        className="absolute inset-0 z-0"
        backgroundColor="transparent"
      />
      {/* World Map Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg 
          viewBox="0 0 100 50" 
          className="w-full h-full opacity-20"
          preserveAspectRatio="none"
        >
          {/* Simplified continents outline */}
          <path 
            d="M10,15 L25,12 L35,15 L45,18 L55,15 L65,12 L75,15 L85,18 L90,20 L85,25 L75,28 L65,30 L55,25 L45,28 L35,30 L25,28 L15,25 L10,20 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-primary/30"
          />
          <path 
            d="M20,25 L35,22 L50,25 L65,28 L80,25 L85,30 L80,35 L65,38 L50,35 L35,38 L20,35 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-primary/20"
          />
        </svg>
      </div>

      {/* Countries as interactive dots */}
      <div className="absolute inset-0 z-10 p-8 pointer-events-none">
        {countries.map((country) => {
          const near = isNear(country);
          return (
            <div
              key={country.id}
              className={`group absolute cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 ${getImportanceScaleClass(country.importance)}`}
              style={{
                left: `${country.x}%`,
                top: `${country.y}%`,
                transition: 'all 0.5s ease-in-out',
              }}
              onClick={() => handleCountryClick(country)}
            >
              <div
                className={
                  `relative rounded-full border-2 flex items-center justify-center transition-transform duration-300 will-change-transform ${getBorderClass(country.infectionLevel)} ${getDotModifiers(country.infectionLevel, country.importance)} ` +
                  `${near ? 'scale-110 red-glow' : ''} hover:scale-110`
                }
                style={{ width: '1.25rem', height: '1.25rem' }}
              >
                {/* Hotspot indicator */}
                {country.isHotspot && (
                  <div className="absolute -inset-1 rounded-full border border-primary-glow animate-pulse" />
                )}
                
                {/* Doctor icons */}
                {country.doctorsAssigned > 0 && (
                  <div className="absolute -top-2 -right-2 bg-primary-glow text-background text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center doctor-icon">
                    {country.doctorsAssigned}
                  </div>
                )}

                {/* Country indicator */}
                <div className={`rounded-full opacity-90 ${getBgClass(country.infectionLevel)}`} style={{ width: '0.5rem', height: '0.5rem' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Country Details Panel */}
      {selectedCountry && (
        <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-6 w-80 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-foreground">{selectedCountry.name}</h3>
              <p className="text-sm text-muted-foreground">
                Population: {selectedCountry.population}M
              </p>
            </div>
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Infection Level</span>
                <span className="text-sm font-bold text-foreground">
                  {Math.round(selectedCountry.infectionLevel)}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedCountry.infectionLevel < 25 ? 'bg-health-good' :
                    selectedCountry.infectionLevel < 50 ? 'bg-health-warning' :
                    selectedCountry.infectionLevel < 75 ? 'bg-infection-medium' :
                    'bg-infection-critical'
                  }`}
                  style={{ width: `${selectedCountry.infectionLevel}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Doctors Assigned</span>
              <span className="text-lg font-bold text-primary-glow">
                {selectedCountry.doctorsAssigned} ⚕️
              </span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Strategic Importance</span>
                <span className="text-sm font-bold text-foreground">
                  {Math.round(selectedCountry.importance)}/100
                  {selectedCountry.importance > 80 && <span className="ml-1 text-primary-glow">★★★</span>}
                  {selectedCountry.importance > 60 && selectedCountry.importance <= 80 && <span className="ml-1 text-primary">★★</span>}
                  {selectedCountry.importance > 40 && selectedCountry.importance <= 60 && <span className="ml-1 text-accent">★</span>}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedCountry.importance < 40 ? 'bg-muted' :
                    selectedCountry.importance < 60 ? 'bg-accent' :
                    selectedCountry.importance < 80 ? 'bg-primary' :
                    'bg-primary-glow'
                  } ${
                    selectedCountry.importance > 80 ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${selectedCountry.importance}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span>
                  {selectedCountry.importance > 80 ? 'Critical global influence' :
                   selectedCountry.importance > 60 ? 'Major regional power' :
                   selectedCountry.importance > 40 ? 'Moderate influence' :
                   'Limited strategic impact'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Economic Value</span>
                <span className="text-sm font-bold text-foreground">
                  {Math.round(selectedCountry.value)}/100
                  {selectedCountry.value > 80 && <span className="ml-1 text-primary-glow">💰💰💰</span>}
                  {selectedCountry.value > 60 && selectedCountry.value <= 80 && <span className="ml-1 text-primary">💰💰</span>}
                  {selectedCountry.value > 40 && selectedCountry.value <= 60 && <span className="ml-1 text-accent">💰</span>}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedCountry.value < 40 ? 'bg-muted' :
                    selectedCountry.value < 60 ? 'bg-accent' :
                    selectedCountry.value < 80 ? 'bg-primary' :
                    'bg-primary-glow'
                  }`}
                  style={{ width: `${selectedCountry.value}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span>
                  {selectedCountry.value > 80 ? 'Global economic powerhouse' :
                   selectedCountry.value > 60 ? 'Strong economic contributor' :
                   selectedCountry.value > 40 ? 'Moderate economic value' :
                   'Developing economy'}
                </span>
              </div>
            </div>

            {selectedCountry.isHotspot && (
              <div className="bg-infection-low/20 border border-infection-low/50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-infection-high">🔥</span>
                  <span className="text-sm font-semibold text-infection-high">Outbreak Hotspot</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  High-priority region. Doctors here are more effective.
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => onAllocateDoctor(selectedCountry.id)}
              disabled={availableDoctors <= 0}
              className="flex-1 bg-primary hover:bg-primary-glow disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Send Doctor
            </button>
            <button
              onClick={() => onRecallDoctor(selectedCountry.id)}
              disabled={selectedCountry.doctorsAssigned <= 0}
              className="flex-1 bg-secondary hover:bg-secondary/80 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            >
              Recall Doctor
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-lg p-4 max-w-md">
        <h4 className="text-sm font-semibold text-foreground mb-2">Instructions</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Click on countries to allocate doctors</li>
          <li>• Focus on hotspot regions (🔥) for maximum impact</li>
          <li>• Monitor infection spread and vaccine progress</li>
          <li>• Advance time to see results of your strategy</li>
        </ul>
      </div>
    </div>
  );
};