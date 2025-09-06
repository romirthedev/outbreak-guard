import { Button } from "@/components/ui/button";
import { Vortex } from "./homebackground";

interface StartScreenProps {
  onStartGame: () => void;
  onHowToPlay: () => void;
}

export const StartScreen = ({ onStartGame, onHowToPlay }: StartScreenProps) => {
  return (
    <Vortex
      backgroundColor="transparent"
      rangeY={800}
      particleCount={500}
      baseHue={310}
      rangeHue={5}
      className="flex items-center flex-col justify-center w-full h-full"
    >
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background world map silhouette */}
        <div className="absolute inset-0 opacity-10">
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-full pulse-red"
            fill="currentColor"
          >
            {/* Simplified world map silhouette */}
            <path d="M150 200 L200 180 L280 190 L350 200 L400 210 L450 200 L500 190 L550 200 L600 190 L650 180 L700 200 L750 190 L800 200 L850 210 L150 200 Z" className="text-primary/30"/>
            <path d="M100 250 L180 240 L250 250 L320 240 L380 250 L450 240 L520 250 L580 240 L650 250 L720 240 L800 250 L880 240 L100 250 Z" className="text-primary/20"/>
            <path d="M200 300 L280 290 L360 300 L440 290 L520 300 L600 290 L680 300 L760 290 L200 300 Z" className="text-primary/25"/>
          </svg>
        </div>

        {/* Main content */}
        <div className="text-center z-10 space-y-8 px-4 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-primary-glow mb-2 tracking-tight">
              Healthcare
            </h1>
            <h1 className="text-6xl md:text-8xl font-bold text-primary mb-8 tracking-tight">
              Meltdown
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
              Can you stop the outbreak before 2025?
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onStartGame}
              className="w-64"
            >
              Start Simulation
            </Button>
            
            <div className="block">
              <Button 
                variant="meltdown" 
                size="lg" 
                onClick={onHowToPlay}
                className="w-64"
              >
                How to Play
              </Button>
            </div>
          </div>

          {/* Atmospheric details */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm text-primary/60 font-mono tracking-widest">
              GLOBAL PANDEMIC SIMULATION
            </div>
            <div className="text-xs text-muted-foreground/40 mt-1">
              2021 - 2025
            </div>
          </div>
        </div>
      </div>
    </Vortex>
  );
};