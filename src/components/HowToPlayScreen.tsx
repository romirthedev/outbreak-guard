import { Button } from "@/components/ui/button";

interface HowToPlayScreenProps {
  onBack: () => void;
}

export const HowToPlayScreen = ({ onBack }: HowToPlayScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Header above panel */}
        <div className="mb-3 flex items-center justify-start">
          <Button variant="meltdown" size="sm" onClick={onBack}>← Back to Home</Button>
        </div>

        {/* Centered panel */}
        <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-xl shadow-lg">
          {/* Scrollable content area */}
          <div className="max-h-[70vh] overflow-y-auto scrollbar-hide p-6 md:p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-glow mb-4">
            How to Play
          </h1>
          <p className="text-lg text-muted-foreground">
            Master the Art of Pandemic Management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Objective */}
          <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h2 className="text-xl font-bold text-foreground">Objective</h2>
            </div>
            <p className="text-muted-foreground">
              You are managing a global hospital network during the COVID-19 pandemic (2021-2025). 
              Your goal is to hold the pandemic at bay long enough for scientists to develop a vaccine before 2026.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded p-3">
              <p className="text-sm text-primary-glow font-semibold">
                Win Condition: Reach 100% vaccine progress before 2026 and before global infection reaches 90%
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚕️</span>
              <h2 className="text-xl font-bold text-foreground">Resources</h2>
            </div>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-primary-glow mt-1">•</span>
                <div>
                  <strong className="text-foreground">8 Doctors:</strong> Your primary resource to fight the pandemic
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-glow mt-1">•</span>
                <div>
                  <strong className="text-foreground">Strategic Allocation:</strong> Assign doctors to countries on the world map
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-glow mt-1">•</span>
                <div>
                  <strong className="text-foreground">Flexibility:</strong> Recall and reassign doctors as needed
                </div>
              </li>
            </ul>
          </div>

          {/* Strategy */}
          <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <h2 className="text-xl font-bold text-foreground">Strategy Tips</h2>
            </div>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-infection-high mt-1">•</span>
                <div>
                  <strong className="text-foreground">Hotspots Matter:</strong> Countries with high importance or value have a higher impact when treated
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-infection-high mt-1">•</span>
                <div>
                  <strong className="text-foreground">Monitor Spread:</strong> Watch infection levels and act quickly
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-infection-high mt-1">•</span>
                <div>
                  <strong className="text-foreground">Balance Resources:</strong> Don't put all doctors in one place
                </div>
              </li>
            </ul>
          </div>

          {/* Game Mechanics */}
          <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚙️</span>
              <h2 className="text-xl font-bold text-foreground">Game Mechanics</h2>
            </div>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-primary-glow mt-1">•</span>
                <div>
                  <strong className="text-foreground">Monthly Turns:</strong> Click "Next Month" to advance time
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-glow mt-1">•</span>
                <div>
                  <strong className="text-foreground">Random Events:</strong> Unexpected events will affect the pandemic's spread
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-glow mt-1">•</span>
                <div>
                  <strong className="text-foreground">Research Progress:</strong> Vaccine development happens automatically
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Progress Bars Legend */}
        <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Progress Indicators</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Global Infection Level</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-3 bg-health-good rounded-full"></div>
                  <span className="text-sm text-muted-foreground">0-25%: Under Control</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-3 bg-health-warning rounded-full"></div>
                  <span className="text-sm text-muted-foreground">25-50%: Concerning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-3 bg-infection-medium rounded-full"></div>
                  <span className="text-sm text-muted-foreground">50-75%: Critical</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-3 bg-infection-critical rounded-full infection-glow"></div>
                  <span className="text-sm text-muted-foreground">75-100%: System Collapse</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Vaccine Progress</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-3 bg-muted rounded-full"></div>
                  <span className="text-sm text-muted-foreground">0-33%: Early Research</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-3 bg-health-warning rounded-full"></div>
                  <span className="text-sm text-muted-foreground">33-66%: Development Phase</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-3 bg-health-good rounded-full red-glow"></div>
                  <span className="text-sm text-muted-foreground">66-100%: Near Completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>

            <div className="text-center pt-2">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={onBack}
                className="w-64"
              >
                Start Playing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};