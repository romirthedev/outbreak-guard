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

export interface Country {
  id: string;
  name: string;
  population: number;
  infectionLevel: number; // 0-100
  doctorsAssigned: number;
  isHotspot: boolean;
  importance: number; // 0-100 strategic importance
  value: number; // 0-100 economic value
  x: number; // Position on map (percentage)
  y: number; // Position on map (percentage)
}

const initialCountries: Country[] = [
  { id: 'china', name: 'China', population: 1400, infectionLevel: 30, doctorsAssigned: 0, isHotspot: true, importance: 85, value: 75, x: 75, y: 35 },
  { id: 'usa', name: 'United States', population: 330, infectionLevel: 40, doctorsAssigned: 0, isHotspot: true, importance: 95, value: 90, x: 20, y: 40 },
  { id: 'india', name: 'India', population: 1380, infectionLevel: 35, doctorsAssigned: 0, isHotspot: true, importance: 80, value: 70, x: 70, y: 50 },
  { id: 'brazil', name: 'Brazil', population: 215, infectionLevel: 45, doctorsAssigned: 0, isHotspot: true, importance: 65, value: 55, x: 35, y: 70 },
  { id: 'italy', name: 'Italy', population: 60, infectionLevel: 50, doctorsAssigned: 0, isHotspot: true, importance: 60, value: 50, x: 52, y: 42 },
  { id: 'germany', name: 'Germany', population: 83, infectionLevel: 25, doctorsAssigned: 0, isHotspot: false, importance: 75, value: 85, x: 50, y: 38 },
  { id: 'france', name: 'France', population: 68, infectionLevel: 30, doctorsAssigned: 0, isHotspot: false, importance: 70, value: 80, x: 48, y: 41 },
  { id: 'uk', name: 'United Kingdom', population: 67, infectionLevel: 33, doctorsAssigned: 0, isHotspot: false, importance: 73, value: 83, x: 47, y: 37 },
  { id: 'japan', name: 'Japan', population: 125, infectionLevel: 23, doctorsAssigned: 0, isHotspot: false, importance: 90, value: 88, x: 82, y: 42 },
  { id: 'australia', name: 'Australia', population: 26, infectionLevel: 20, doctorsAssigned: 0, isHotspot: false, importance: 60, value: 65, x: 80, y: 80 },
];

const randomEvents = [
  "New COVID variant detected - infection spreads faster",
  "Global travel restrictions lifted - infection accelerates",
  "Successful lockdown measures - infection stabilizes temporarily",
  "Medical supply shortage - doctor effectiveness reduced",
  "International cooperation increases - vaccine research boosted",
  "Doctor burnout - lose 1-2 doctors permanently",
  "Breakthrough treatment shows promise - infection slowed",
  "Social distancing fatigue - infection rates climb",
  "Vaccine research setback - progress slowed",
  "Anti-vaccination movement grows - infection spreads faster",
  "Hospital capacity reached - healthcare system strained",
  "Supply chain disruption - resource distribution delayed",
  "Viral mutation - vaccine effectiveness reduced",
  "Healthcare worker strikes - doctor effectiveness decreased",
  "Economic recession - funding for research cut",
  "Political interference - coordinated response hindered",
  "Mass gatherings resume - infection spikes in multiple regions",
  "Vaccine distribution challenges - rollout slowed",
  "Pandemic fatigue - public compliance with measures drops",
  "Critical infrastructure failure - healthcare delivery impacted",
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
      availableDoctors: 8, // Reduced from 10 to 8 for increased difficulty
      totalDoctors: 8, // Reduced from 10 to 8 for increased difficulty
      globalInfection: 20, // Increased from 15 to 20 for higher starting difficulty
      vaccineProgress: 0,
      gameStatus: 'playing',
      monthlyEvents: ["Global pandemic declared - infection rates rising worldwide"],
    });
    
    // Randomize initial country importance and values slightly for each game
    const randomizedCountries = initialCountries.map(country => ({
      ...country,
      importance: Math.max(0, Math.min(100, country.importance + (Math.random() * 10 - 5))),
      value: Math.max(0, Math.min(100, country.value + (Math.random() * 10 - 5))),
    }));
    
    setCountries(randomizedCountries);
  }, []);

  const allocateDoctor = useCallback((countryId: string) => {
    if (gameState.availableDoctors <= 0) return;

    setCountries(prev => {
      const country = prev.find(c => c.id === countryId);
      if (!country) return prev;
      
      // Limit doctors based on country importance - more important countries can have more doctors
      const importanceBasedLimit = Math.ceil(country.importance / 20); // 1-5 doctors based on importance
      
      // If already at limit, don't allow more doctors
      if (country.doctorsAssigned >= importanceBasedLimit) {
        // Add a message about this limitation
        setGameState(prevState => ({
          ...prevState,
          monthlyEvents: [...prevState.monthlyEvents, 
            `${country.name} cannot support more than ${importanceBasedLimit} doctors due to infrastructure limitations.`
          ]
        }));
        return prev;
      }
      
      return prev.map(c => 
        c.id === countryId 
          ? { ...c, doctorsAssigned: c.doctorsAssigned + 1 }
          : c
      );
    });

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

    // Infection calculation - higher base rate for increased difficulty
    let infectionChange = 15; // Significantly increased base spread rate (from 12 to 15)
    infectionChange -= (totalAssignedDoctors * 0.3); // Further reduced doctor effectiveness (from 0.4 to 0.3)
    infectionChange -= (hotspotCoverage * 1.0); // Further reduced hotspot coverage bonus (from 1.2 to 1.0)

    // Random event impact - more volatile
    const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    const eventImpact = Math.random() * 15 - 5; // -5 to +10 (skewed toward negative outcomes, increased from 12 to 15)
    infectionChange += eventImpact;

    // Additional difficulty based on time progression
    const monthsElapsed = (newYear - 2021) * 12 + newMonth - 1;
    if (monthsElapsed > 12) {
      // After first year, infection becomes harder to control
      infectionChange += (monthsElapsed / 10); // Gradually increasing difficulty (from /12 to /10)
    }

    let newGlobalInfection = Math.max(0, Math.min(100, gameState.globalInfection + infectionChange));

    // Handle special events
    let doctorsLostThisMonth = 0;
    let vaccineSetback = false;
    
    if (randomEvent.includes("Doctor burnout")) {
      doctorsLostThisMonth = Math.floor(Math.random() * 2) + 1; // Lose 1 or 2 doctors
      setGameState(prev => ({
        ...prev,
        totalDoctors: Math.max(0, prev.totalDoctors - doctorsLostThisMonth),
        availableDoctors: Math.max(0, prev.availableDoctors - doctorsLostThisMonth),
      }));
    }
    
    if (randomEvent.includes("Vaccine research setback")) {
      vaccineSetback = true;
    }

    // Vaccine progress - slower progress for increased difficulty
    // Now takes 84 months (7 years) instead of 72 months (6 years) to complete naturally
    const baseVaccineProgress = (monthsElapsed / 84) * 100; 
    
    // Reduced doctor impact on vaccine and potential setbacks
    let vaccineBoost = totalAssignedDoctors * 0.2; // Reduced from 0.25 to 0.2
    
    // Apply vaccine setback if the event occurred
    if (vaccineSetback) {
      vaccineBoost -= 7; // Significant setback (increased from 5 to 7)
    }
    
    // If anti-vaccination event, further reduce progress
    if (randomEvent.includes("Anti-vaccination")) {
      vaccineBoost -= 4; // Increased from 3 to 4
    }
    
    // Slower vaccine progress convergence
    const newVaccineProgress = Math.max(0, Math.min(100, gameState.vaccineProgress + (baseVaccineProgress - gameState.vaccineProgress) * 0.08 + vaccineBoost)); // Reduced from 0.1 to 0.08

    // Update country infection levels with more dynamic changes
    setCountries(prev => 
      prev.map(country => {
        // Reduced doctor effectiveness
        const doctorEffect = country.doctorsAssigned * (country.isHotspot ? 2.0 : 1.0); // Reduced from 2.5/1.2 to 2.0/1.0
        
        // Infection spread now considers country importance more significantly
        const importanceFactor = country.importance / 80; // Normalize importance with higher weight (from /100 to /80)
        
        // Country-specific infection volatility based on population and current infection
        const volatility = (country.population / 400) * (country.infectionLevel / 40) * (Math.random() * 18 - 8); // Increased volatility
        
        const newInfectionLevel = Math.max(0, Math.min(100, 
          country.infectionLevel + (infectionChange * 0.8 * importanceFactor) - doctorEffect + volatility
        )); // Increased infection spread factor from 0.7 to 0.8

        // More significant and dynamic value and importance shifts
        // Countries with higher infection levels become more important (crisis response)
        const infectionImpact = (country.infectionLevel / 100) * 7; // Up to +7 importance based on infection (increased from 5)
        
        // Time-based fluctuations - different countries peak in importance at different times
        // More dramatic shifts with higher frequency
        const timeFactor = Math.sin((monthsElapsed + country.population % 18) / 9 * Math.PI) * 6; // Changed from 24/12/4 to 18/9/6
        
        // Random fluctuation component - more volatile
        const randomFluctuation = Math.random() * 8 - 4; // +/- 4 (increased from 6-3)
        
        // Economic value shifts based on infection level - countries with high infection see economic decline
        const economicImpact = country.infectionLevel > 60 ? -3 : country.infectionLevel > 40 ? -1 : 1;
        
        const newValue = Math.max(0, Math.min(100, country.value + randomFluctuation + timeFactor + economicImpact));
        const newImportance = Math.max(0, Math.min(100, 
          country.importance + infectionImpact + timeFactor + randomFluctuation
        ));

        // Hotspot status can change based on infection level and importance
        let newHotspotStatus = country.isHotspot;
        
        // 10% chance each month of hotspot status changing based on conditions
        if (Math.random() < 0.1) {
          if (country.infectionLevel > 60 && country.importance > 70) {
            newHotspotStatus = true; // High infection + high importance = hotspot
          } else if (country.infectionLevel < 20 && country.isHotspot) {
            newHotspotStatus = false; // Low infection can resolve hotspot status
          }
        }

        return { 
          ...country, 
          infectionLevel: newInfectionLevel, 
          value: newValue, 
          importance: newImportance,
          isHotspot: newHotspotStatus
        };
      })
    );

    // Check win/lose conditions - harder to win
    let newGameStatus = gameState.gameStatus;
    if (newVaccineProgress >= 100 && newYear >= 2027) { // Extended win condition by another year (from 2026 to 2027)
      newGameStatus = 'won';
    } else if (newGlobalInfection >= 90) { // Lower threshold for losing (from 95 to 90)
      newGameStatus = 'lost';
    }

    // Generate event message
    let eventMessages = [randomEvent];
    if (doctorsLostThisMonth > 0) {
      eventMessages.push(`Doctor burnout: Lost ${doctorsLostThisMonth} doctor(s).`);
    }
    if (vaccineSetback) {
      eventMessages.push("Vaccine research faced significant setbacks.");
    }

    setGameState(prev => ({
      ...prev,
      currentMonth: newMonth,
      currentYear: newYear,
      globalInfection: newGlobalInfection,
      vaccineProgress: newVaccineProgress,
      gameStatus: newGameStatus,
      monthlyEvents: eventMessages,
    }));
  }, [gameState, countries]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'menu' }));
  }, []);

  const researchInvestment = useCallback(() => {
    setGameState(prev => {
      if (prev.availableDoctors < 2) return prev; // Not enough doctors

      // Calculate diminishing returns based on current progress
      // As vaccine progress increases, research investment becomes less effective
      const progressFactor = Math.max(0.5, 1 - (prev.vaccineProgress / 100)); // Ranges from 1.0 to 0.5
      const boost = Math.ceil(8 * progressFactor); // Ranges from 8 to 4 (reduced from flat 10)

      return {
        ...prev,
        availableDoctors: prev.availableDoctors - 2,
        vaccineProgress: Math.min(100, prev.vaccineProgress + boost),
        monthlyEvents: [...prev.monthlyEvents, `Research Investment: Vaccine research boosted by ${boost}%!`]
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