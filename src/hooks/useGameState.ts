import { useState, useCallback } from 'react';

export interface Country {
  id: string;
  name: string;
  population: number;
  infectionLevel: number; // 0-100
  doctorsAssigned: number;
  isHotspot: boolean;
  x: number; // Position on map (percentage)
  y: number; // Position on map (percentage)
}

export interface GameState {
  currentMonth: number;
  currentYear: number;
  availableDoctors: number;
  totalDoctors: number;
  globalInfection: number; // 0-100
  vaccineProgress: number; // 0-100
  gameStatus: 'menu' | 'playing' | 'won' | 'lost';
  monthlyEvents: string[];
}

const initialCountries: Country[] = [
  { id: 'china', name: 'China', population: 1400, infectionLevel: 15, doctorsAssigned: 0, isHotspot: true, x: 75, y: 35 },
  { id: 'usa', name: 'United States', population: 330, infectionLevel: 25, doctorsAssigned: 0, isHotspot: true, x: 20, y: 40 },
  { id: 'india', name: 'India', population: 1380, infectionLevel: 20, doctorsAssigned: 0, isHotspot: true, x: 70, y: 50 },
  { id: 'brazil', name: 'Brazil', population: 215, infectionLevel: 30, doctorsAssigned: 0, isHotspot: true, x: 35, y: 70 },
  { id: 'italy', name: 'Italy', population: 60, infectionLevel: 40, doctorsAssigned: 0, isHotspot: true, x: 52, y: 42 },
  { id: 'germany', name: 'Germany', population: 83, infectionLevel: 10, doctorsAssigned: 0, isHotspot: false, x: 50, y: 38 },
  { id: 'france', name: 'France', population: 68, infectionLevel: 15, doctorsAssigned: 0, isHotspot: false, x: 48, y: 41 },
  { id: 'uk', name: 'United Kingdom', population: 67, infectionLevel: 18, doctorsAssigned: 0, isHotspot: false, x: 47, y: 37 },
  { id: 'japan', name: 'Japan', population: 125, infectionLevel: 8, doctorsAssigned: 0, isHotspot: false, x: 82, y: 42 },
  { id: 'australia', name: 'Australia', population: 26, infectionLevel: 5, doctorsAssigned: 0, isHotspot: false, x: 80, y: 80 },
];

const randomEvents = [
  "New COVID variant detected - infection spreads faster",
  "Global travel restrictions lifted - infection accelerates",
  "Successful lockdown measures - infection stabilizes temporarily",
  "Medical supply shortage - doctor effectiveness reduced",
  "International cooperation increases - vaccine research boosted",
  "Doctor burnout - lose 1 doctor permanently",
  "Breakthrough treatment shows promise - infection slowed",
  "Social distancing fatigue - infection rates climb",
];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentMonth: 1,
    currentYear: 2021,
    availableDoctors: 10,
    totalDoctors: 10,
    globalInfection: 15,
    vaccineProgress: 0,
    gameStatus: 'menu',
    monthlyEvents: [],
  });

  const [countries, setCountries] = useState<Country[]>(initialCountries);

  const startGame = useCallback(() => {
    setGameState({
      currentMonth: 1,
      currentYear: 2021,
      availableDoctors: 10,
      totalDoctors: 10,
      globalInfection: 15,
      vaccineProgress: 0,
      gameStatus: 'playing',
      monthlyEvents: [],
    });
    setCountries(initialCountries);
  }, []);

  const allocateDoctor = useCallback((countryId: string) => {
    if (gameState.availableDoctors <= 0) return;

    setCountries(prev => 
      prev.map(country => 
        country.id === countryId 
          ? { ...country, doctorsAssigned: country.doctorsAssigned + 1 }
          : country
      )
    );

    setGameState(prev => ({
      ...prev,
      availableDoctors: prev.availableDoctors - 1,
    }));
  }, [gameState.availableDoctors]);

  const recallDoctor = useCallback((countryId: string) => {
    setCountries(prev => {
      const country = prev.find(c => c.id === countryId);
      if (!country || country.doctorsAssigned <= 0) return prev;

      return prev.map(c => 
        c.id === countryId 
          ? { ...c, doctorsAssigned: c.doctorsAssigned - 1 }
          : c
      );
    });

    setGameState(prev => ({
      ...prev,
      availableDoctors: prev.availableDoctors + 1,
    }));
  }, []);

  const advanceMonth = useCallback(() => {
    const newMonth = gameState.currentMonth === 12 ? 1 : gameState.currentMonth + 1;
    const newYear = gameState.currentMonth === 12 ? gameState.currentYear + 1 : gameState.currentYear;

    // Calculate infection spread and vaccine progress
    const totalAssignedDoctors = countries.reduce((sum, country) => sum + country.doctorsAssigned, 0);
    const hotspotCoverage = countries
      .filter(c => c.isHotspot)
      .reduce((sum, country) => sum + (country.doctorsAssigned > 0 ? 1 : 0), 0);

    // Infection calculation (simplified)
    let infectionChange = 5; // Base spread rate
    infectionChange -= (totalAssignedDoctors * 0.8); // Doctor effectiveness
    infectionChange -= (hotspotCoverage * 2); // Hotspot coverage bonus

    // Random event impact
    const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    const eventImpact = Math.random() * 10 - 5; // -5 to +5
    infectionChange += eventImpact;

    let newGlobalInfection = Math.max(0, Math.min(100, gameState.globalInfection + infectionChange));

    let doctorsLostThisMonth = 0;
    if (randomEvent.includes("Doctor burnout")) {
      doctorsLostThisMonth = Math.floor(Math.random() * 2) + 1; // Lose 1 or 2 doctors
      setGameState(prev => ({
        ...prev,
        totalDoctors: Math.max(0, prev.totalDoctors - doctorsLostThisMonth),
        availableDoctors: Math.max(0, prev.availableDoctors - doctorsLostThisMonth),
      }));
    }

    // Vaccine progress (2% base per month, reaching 100% by Jan 2025)
    const monthsElapsed = (newYear - 2021) * 12 + newMonth - 1;
    const baseVaccineProgress = (monthsElapsed / 48) * 100; // 48 months to completion
    const newVaccineProgress = Math.min(100, baseVaccineProgress + (totalAssignedDoctors * 0.5));

    // Update country infection levels
    setCountries(prev => 
      prev.map(country => {
        const doctorEffect = country.doctorsAssigned * (country.isHotspot ? 3 : 1.5); // Hotspots more effective
        const newInfectionLevel = Math.max(0, Math.min(100, 
          country.infectionLevel + (infectionChange * 0.5) - doctorEffect + (Math.random() * 10 - 5)
        ));
        return { ...country, infectionLevel: newInfectionLevel };
      })
    );

    // Check win/lose conditions
    let newGameStatus = gameState.gameStatus;
    if (newVaccineProgress >= 100 && newYear >= 2025) {
      newGameStatus = 'won';
    } else if (newGlobalInfection >= 100) {
      newGameStatus = 'lost';
    }

    setGameState(prev => ({
      ...prev,
      currentMonth: newMonth,
      currentYear: newYear,
      globalInfection: newGlobalInfection,
      vaccineProgress: newVaccineProgress,
      gameStatus: newGameStatus,
      monthlyEvents: [randomEvent, ...(doctorsLostThisMonth > 0 ? [`Doctor burnout: Lost ${doctorsLostThisMonth} doctor(s).`] : [])],
    }));
  }, [gameState, countries]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'menu' }));
  }, []);

  const researchInvestment = useCallback(() => {
    setGameState(prev => {
      if (prev.availableDoctors < 2) return prev; // Not enough doctors

      return {
        ...prev,
        availableDoctors: prev.availableDoctors - 2,

        vaccineProgress: Math.min(100, prev.vaccineProgress + 10), // Boost vaccine progress
        monthlyEvents: [...prev.monthlyEvents, "Research Investment: Vaccine research boosted!"]
      };
    });
  }, []);

  return {
    gameState,
    countries,
    startGame,
    allocateDoctor,
    recallDoctor,
    advanceMonth,
    resetGame,
    researchInvestment,
  };
};