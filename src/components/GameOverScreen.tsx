import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/useSound";
import { useEffect } from "react";

interface GameOverScreenProps {
  isVictory: boolean;
  finalMonth: number;
  finalYear: number;
  finalInfection: number;
  vaccineProgress: number;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export const GameOverScreen = ({ 
  isVictory, 
  finalMonth, 
  finalYear, 
  finalInfection, 
  vaccineProgress, 
  onPlayAgain, 
  onReturnToMenu 
}: GameOverScreenProps) => {
  const { playSound } = useSound();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Play appropriate sound effect when component mounts
  useEffect(() => {
    if (isVictory) {
      playSound('you-win', 3);
    } else {
      playSound('alarm', 3);
    }
  }, [isVictory, playSound]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated background based on outcome */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isVictory 
          ? 'bg-gradient-to-br from-health-good/20 to-background' 
          : 'bg-gradient-to-br from-infection-critical/30 to-background'
      }`}>
        <div className={`absolute inset-0 ${
          isVictory 
            ? 'animate-pulse opacity-20' 
            : 'infection-glow opacity-30'
        }`} />
      </div>

      {/* Main content */}
      <div className="text-center z-10 space-y-8 px-4 max-w-2xl">
        <div className="space-y-6">
          {isVictory ? (
            <>
              <div className="text-6xl mb-4">🏆</div>
              <h1 className="text-5xl md:text-7xl font-bold text-health-good mb-4">
                Victory
              </h1>
              <p className="text-xl md:text-2xl text-foreground font-light">
                The world survives. Vaccine developed, {finalYear}.
              </p>
              <p className="text-lg text-muted-foreground">
                Humanity has prevailed against the pandemic through your strategic allocation of medical resources.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">💀</div>
              <h1 className="text-5xl md:text-7xl font-bold text-infection-critical mb-4">
                Defeat
              </h1>
              <p className="text-xl md:text-2xl text-foreground font-light">
                Healthcare System Collapse. Humanity Fails.
              </p>
              <p className="text-lg text-muted-foreground">
                The pandemic has overwhelmed global healthcare systems. The outbreak reached critical levels before a vaccine could be developed.
              </p>
            </>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Final Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Simulation Ended</div>
              <div className="text-lg font-bold text-foreground">
                {monthNames[finalMonth - 1]} {finalYear}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-muted-foreground">Vaccine Progress</div>
              <div className={`text-lg font-bold ${
                vaccineProgress >= 100 ? 'text-health-good' : 'text-health-warning'
              }`}>
                {Math.round(vaccineProgress)}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-muted-foreground">Global Infection</div>
              <div className={`text-lg font-bold ${
                finalInfection >= 100 ? 'text-infection-critical' : 
                finalInfection >= 75 ? 'text-infection-high' :
                finalInfection >= 50 ? 'text-infection-medium' : 'text-health-good'
              }`}>
                {Math.round(finalInfection)}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-muted-foreground">Outcome</div>
              <div className={`text-lg font-bold ${
                isVictory ? 'text-health-good' : 'text-infection-critical'
              }`}>
                {isVictory ? 'SUCCESS' : 'FAILURE'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            variant={isVictory ? "hero" : "danger"} 
            size="xl" 
            onClick={onPlayAgain}
            className="w-64"
          >
            Try Again
          </Button>
          
          <div className="block">
            <Button 
              variant="meltdown" 
              size="lg" 
              onClick={onReturnToMenu}
              className="w-64"
            >
              Return to Menu
            </Button>
          </div>
        </div>

        {/* Quote based on outcome */}
        <div className="pt-8">
          <blockquote className="text-sm italic text-muted-foreground max-w-md mx-auto">
            {isVictory 
              ? '"In the face of a global crisis, strategic coordination and medical expertise proved to be humanity\'s greatest weapons."'
              : '"Sometimes, despite our best efforts, the complexity of a global pandemic can overwhelm even the most prepared healthcare systems."'
            }
          </blockquote>
        </div>
      </div>
    </div>
  );
};