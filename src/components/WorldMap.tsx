import { useState } from 'react';
import type { Country } from '@/hooks/useGameState';

interface WorldMapProps {
  countries: Country[];
  onAllocateDoctor: (countryId: string) => void;
  onRecallDoctor: (countryId: string) => void;
  availableDoctors: number;
}

export const WorldMap = ({ countries, onAllocateDoctor, onRecallDoctor, availableDoctors }: WorldMapProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const getInfectionIntensity = (level: number) => {
    if (level < 25) return "bg-secondary border-muted";
    if (level < 50) return "bg-infection-low border-infection-low";
    if (level < 75) return "bg-infection-medium border-infection-medium";
    return "bg-infection-critical border-infection-critical infection-glow";
  };

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
  };

  return (
    <div className="relative w-full h-full bg-gradient-dark overflow-hidden">
      {/* World Map Background */}
      <div className="absolute inset-0">
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
      <div className="absolute inset-0 p-8">
        {countries.map((country) => (
          <div
            key={country.id}
            className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 ${getInfectionIntensity(country.infectionLevel)}`}
            style={{
              left: `${country.x}%`,
              top: `${country.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handleCountryClick(country)}
          >
            <div className="relative w-8 h-8 rounded-full border-2 flex items-center justify-center">
              {/* Hotspot indicator */}
              {country.isHotspot && (
                <div className="absolute -inset-1 rounded-full border border-primary-glow animate-pulse" />
              )}
              
              {/* Doctor icons */}
              {country.doctorsAssigned > 0 && (
                <div className="absolute -top-2 -right-2 bg-primary-glow text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center doctor-icon">
                  {country.doctorsAssigned}
                </div>
              )}

              {/* Country indicator */}
              <div className="w-3 h-3 rounded-full bg-current opacity-80" />
            </div>
          </div>
        ))}
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