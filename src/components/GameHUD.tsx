import React from 'react';

export interface GameHUDProps {
  availableDoctors: number;
  totalDoctors: number;
  currentMonth: number;
  currentYear: number;
  globalInfection: number;
  vaccineProgress: number;
  onAdvanceMonth: () => void;
  onResearchInvestment: () => void;
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
  onAdvanceMonth,
  onResearchInvestment,
}: GameHUDProps) => {
  const getInfectionColor = (level: number) => {
    if (level < 25) return "bg-health-good";
    if (level < 50) return "bg-health-warning";
    if (level < 75) return "bg-infection-medium";
    return "bg-infection-critical";
  };

  const getVaccineColor = (progress: number) => {
    if (progress < 33) return "bg-muted";
    if (progress < 66) return "bg-health-warning";
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
                  globalInfection > 75 ? 'infection-glow' : ''
                }`}
                style={{ width: `${globalInfection}%` }}
              />
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
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onResearchInvestment}
            disabled={availableDoctors < 2 || (currentYear === 2021 && currentMonth < 7)}
            className="bg-accent hover:bg-accent/80 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Research Investment (-2 Docs) 
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