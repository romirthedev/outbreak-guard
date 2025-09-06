import React from 'react';

// GameHUD component props interface
export interface GameHUDProps {
  availableDoctors: number;
  totalDoctors: number;
  currentMonth: number;
  currentYear: number;
  globalInfection: number;
  vaccineProgress: number;
  totalAssignedDoctors?: number;
  researchCommittedDoctors?: number;
  onAdvanceMonth: () => void;
  onResearchInvestment: () => void;
  onResearchRecall: () => void;
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const GameHUD = ({
  availableDoctors,
  totalDoctors,
  currentMonth,
  currentYear,
  globalInfection,
  vaccineProgress,
  totalAssignedDoctors = 0,
  researchCommittedDoctors = 0,
  onAdvanceMonth,
  onResearchInvestment,
  onResearchRecall,
}: GameHUDProps) => {
  const getInfectionColor = (level: number) => {
    if (level < 15) return "bg-health-good"; // Reduced threshold from 20 to 15
    if (level < 35) return "bg-health-warning"; // Reduced threshold from 40 to 35
    if (level < 55) return "bg-infection-medium"; // Reduced threshold from 60 to 55
    if (level < 75) return "bg-infection-high"; // Reduced threshold from 80 to 75
    return "bg-infection-critical";
  };

  const getVaccineColor = (progress: number) => {
    if (progress < 30) return "bg-muted"; // Increased threshold from 25 to 30
    if (progress < 60) return "bg-accent"; // Increased threshold from 50 to 60
    if (progress < 85) return "bg-health-warning"; // Increased threshold from 75 to 85
    return "bg-health-good";
  };
  



  return (
    <div className="bg-card/90 backdrop-blur-sm border-b border-primary/20 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Resources */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-primary-glow text-lg">⚕️</span>
            <div>
              <div className="text-sm text-muted-foreground">Doctors (Avail/Total)</div>
              <div className="text-xl font-bold text-foreground">{availableDoctors}/{totalDoctors}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-primary text-lg">📅</span>
            <div>
              <div className="text-sm text-muted-foreground">Current Date</div>
              <div className="text-xl font-bold text-foreground">
                {monthNames[currentMonth - 1]} {currentYear}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Progress Bars */}
        <div className="flex items-center space-x-8">
          <div className="w-48">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Global Infection</span>
              <span className="text-sm font-bold text-foreground">{Math.round(globalInfection)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getInfectionColor(globalInfection)} ${
                  globalInfection > 60 ? 'infection-glow' : ''
                }`}
                style={{ width: `${globalInfection}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className={globalInfection > 75 ? 'text-infection-critical' : ''}>
                {globalInfection > 85 ? 'CRITICAL: System collapse imminent!' :
                 globalInfection > 75 ? 'SEVERE: Healthcare systems failing' :
                 globalInfection > 55 ? 'HIGH: Resources strained' :
                 globalInfection > 35 ? 'MODERATE: Concerning spread' :
                 globalInfection > 15 ? 'CAUTIOUS: Situation developing' :
                 'CONTROLLED'}
              </span>
            </div>
          </div>

          <div className="w-48">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Vaccine Progress</span>
              <span className="text-sm font-bold text-foreground">{Math.round(vaccineProgress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getVaccineColor(vaccineProgress)} ${
                  vaccineProgress > 80 ? 'red-glow' : ''
                }`}
                style={{ width: `${vaccineProgress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex justify-between">
              <span>
                {vaccineProgress < 15 ? 'Early research' :
                 vaccineProgress < 35 ? 'Prototype development' :
                 vaccineProgress < 60 ? 'Clinical trials' :
                 vaccineProgress < 80 ? 'Production scaling' :
                 vaccineProgress < 95 ? 'Distribution planning' :
                 'Final approval'}
              </span>
              <span className="font-medium">
                Allocated: <span className="text-foreground">{researchCommittedDoctors}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onResearchInvestment}
            disabled={availableDoctors < 2}
            className="bg-accent hover:bg-accent/80 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            title="Invest doctors in vaccine research. Returns diminish as research progresses and challenges become more complex."
          >
            Research Investment
          </button>
          <button
            onClick={onResearchRecall}
            disabled={researchCommittedDoctors === 0}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-muted disabled:text-muted-foreground text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            title="Recall all doctors from research and return them to the available pool."
          >
            Research Recall
          </button>
          <button
            onClick={onAdvanceMonth}
            className="bg-primary hover:bg-primary-glow text-primary-foreground px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 red-glow"
          >
            Next Month
          </button>
        </div>
      </div>
    </div>
  );
};