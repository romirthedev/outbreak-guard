import { useState, useCallback, useMemo, useRef } from 'react';

export type MonthlyEffect = {
  type: 'researchBoost' | 'addDoctors' | 'spreadDecrease' | 'spreadIncrease' | 'loseDoctors';
  value: number;
};

export interface MonthlyChoiceOption {
  id: string;
  text: string;
  effect: MonthlyEffect;
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

export interface GameState {
  currentMonth: number;
  currentYear: number;
  availableDoctors: number;
  totalDoctors: number;
  globalInfection: number; // 0-100
  vaccineProgress: number; // 0-100
  gameStatus: 'menu' | 'playing' | 'won' | 'lost';
  monthlyEvents: string[];
  researchCommittedDoctors: number; // Doctors allocated to research investment
  lastVaccineDelta: number; // Progress gained during the last month advancement
  pendingMonthlyChoices: MonthlyChoiceOption[]; // Monthly choice options that persist until selected
}

const initialCountries: Country[] = [
  { id: 'china', name: 'China', population: 1400, infectionLevel: 30, doctorsAssigned: 0, isHotspot: true, importance: 85, value: 85, x: 75, y: 45 }, // Moved up slightly
  { id: 'usa', name: 'United States', population: 330, infectionLevel: 40, doctorsAssigned: 0, isHotspot: true, importance: 95, value: 90, x: 20, y: 40 },
  { id: 'india', name: 'India', population: 1380, infectionLevel: 35, doctorsAssigned: 0, isHotspot: true, importance: 60, value: 60, x: 67, y: 52 },
  { id: 'brazil', name: 'Brazil', population: 215, infectionLevel: 45, doctorsAssigned: 0, isHotspot: true, importance: 35, value: 55, x: 35, y: 70 },
  { id: 'italy', name: 'Italy', population: 60, infectionLevel: 50, doctorsAssigned: 0, isHotspot: true, importance: 60, value: 50, x: 50, y: 39 },
  { id: 'germany', name: 'Germany', population: 83, infectionLevel: 25, doctorsAssigned: 0, isHotspot: false, importance: 45, value: 65, x: 49.5, y: 33 },
  { id: 'france', name: 'France', population: 68, infectionLevel: 30, doctorsAssigned: 0, isHotspot: false, importance: 70, value: 50, x: 47, y: 37 },
  { id: 'uk', name: 'United Kingdom', population: 67, infectionLevel: 33, doctorsAssigned: 0, isHotspot: false, importance: 73, value: 73, x: 46, y: 33 },
  { id: 'australia', name: 'Australia', population: 26, infectionLevel: 20, doctorsAssigned: 0, isHotspot: false, importance: 30, value: 65, x: 80, y: 80 },
  { id: 'nigeria', name: 'Nigeria', population: 200, infectionLevel: 40, doctorsAssigned: 0, isHotspot: true, importance: 10, value: 10, x: 48.5, y: 59 }, // New African country
  { id: 'southafrica', name: 'South Africa', population: 60, infectionLevel: 35, doctorsAssigned: 0, isHotspot: true, importance: 25, value: 15, x: 54, y: 80 }, // New African country
  { id: 'egypt', name: 'Egypt', population: 100, infectionLevel: 30, doctorsAssigned: 0, isHotspot: false, importance: 30, value: 50, x: 55, y: 50 }, // Moved up slightly
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
    researchCommittedDoctors: 0,
    lastVaccineDelta: 0,
    pendingMonthlyChoices: [],
  });

  const [countries, setCountries] = useState<Country[]>(initialCountries);

  // Helper functions to reduce code duplication
  const getTotalAssignedDoctors = useCallback(() => {
    return countries.reduce((sum, country) => sum + country.doctorsAssigned, 0);
  }, [countries]);

  const calculateExpectedAvailableDoctors = useCallback((totalDoctors: number, researchCommitted: number = 0) => {
    const totalAssigned = getTotalAssignedDoctors();
    return Math.max(0, totalDoctors - totalAssigned - researchCommitted);
  }, [getTotalAssignedDoctors]);

  const clampToPercentage = useCallback((value: number) => {
    // Ensure the value is finite before clamping
    if (!isFinite(value)) {
      console.warn(`Invalid value detected in clampToPercentage: ${value}`);
      return 0;
    }
    return Math.max(0, Math.min(100, value));
  }, []);

  // Helper function to validate and sanitize numeric values
  const sanitizeNumber = useCallback((value: unknown, fallback: number = 0) => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    return isFinite(num) ? num : fallback;
  }, []);

  // Generate monthly choice options
  const generateMonthlyChoices = useCallback((): MonthlyChoiceOption[] => {
    const options: MonthlyChoiceOption[] = [
      { id: 'option1', text: 'Focus on Vaccine Research', effect: { type: 'researchBoost', value: 10 } },
      { id: 'option2', text: 'Recruit More Doctors', effect: { type: 'addDoctors', value: 2 } },
      { id: 'option3', text: 'Implement Strict Lockdowns', effect: { type: 'spreadDecrease', value: 5 } },
      { id: 'option4', text: 'Relax Restrictions', effect: { type: 'spreadIncrease', value: 8 } },
      { id: 'option5', text: 'Doctor Fatigue', effect: { type: 'loseDoctors', value: 1 } },
    ];
    const numOptions = Math.floor(Math.random() * 4) + 2; // 2 to 5 options
    const shuffled = options.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numOptions);
  }, []);

  const startGame = useCallback(() => {
    // Generate initial monthly choices for the first month
    const initialChoices = generateMonthlyChoices();
    
    setGameState({
      currentMonth: 1,
      currentYear: 2021,
      availableDoctors: 8, // Reduced from 10 to 8 for increased difficulty
      totalDoctors: 8, // Reduced from 10 to 8 for increased difficulty
      globalInfection: 20, // Increased from 15 to 20 for higher starting difficulty
      vaccineProgress: 0,
      gameStatus: 'playing',
      monthlyEvents: ["Global pandemic declared - infection rates rising worldwide"],
      researchCommittedDoctors: 0,
      lastVaccineDelta: 0,
      pendingMonthlyChoices: initialChoices,
    });
    
    // Randomize initial country importance and values slightly for each game
    const randomizedCountries = initialCountries.map(country => ({
      ...country,
      importance: clampToPercentage(country.importance + (Math.random() * 10 - 5)),
      value: clampToPercentage(country.value + (Math.random() * 10 - 5)),
    }));
    
    setCountries(randomizedCountries);
  }, [generateMonthlyChoices, clampToPercentage]);

  const allocateDoctor = useCallback((countryId: string) => {
    if (gameState.availableDoctors <= 0) {
      return;
    }

    setCountries(prev => {
      const country = prev.find(c => c.id === countryId);
      if (!country) return prev;
      
      // Limit doctors based on country importance - more important countries can have more doctors
      const importanceBasedLimit = Math.ceil(country.importance / 20); // 1-5 doctors based on importance
      
      // If already at limit, don't allow more doctors
      if (country.doctorsAssigned >= importanceBasedLimit) {
        return prev;
      }
      
      // Update countries state and game state atomically
      const updatedCountries = prev.map(c => 
        c.id === countryId 
          ? { ...c, doctorsAssigned: c.doctorsAssigned + 1 }
          : c
      );
      
      // Update game state with the new available doctors count
      setGameState(prevState => ({
        ...prevState,
        availableDoctors: Math.max(0, prevState.availableDoctors - 1),
      }));
      
      return updatedCountries;
    });
  }, [gameState.availableDoctors]);

  const recallDoctor = useCallback((countryId: string) => {
    setCountries(prev => {
      const country = prev.find(c => c.id === countryId);
      if (!country || country.doctorsAssigned <= 0) {
        return prev;
      }

      // Calculate total assigned doctors after recall to ensure we don't exceed totalDoctors
      const totalAssignedAfterRecall = prev.reduce((sum, c) => 
        sum + (c.id === countryId ? c.doctorsAssigned - 1 : c.doctorsAssigned), 0
      );
      
      const newAvailableDoctors = gameState.totalDoctors - totalAssignedAfterRecall - (gameState.researchCommittedDoctors || 0);
      
      // Update game state with proper validation
      setGameState(prevState => ({
        ...prevState,
        availableDoctors: Math.max(0, Math.min(newAvailableDoctors, prevState.totalDoctors)),
      }));

      return prev.map(c => 
        c.id === countryId 
          ? { ...c, doctorsAssigned: c.doctorsAssigned - 1 }
          : c
      );
    });
  }, [gameState.totalDoctors, gameState.researchCommittedDoctors]);

  const advanceMonth = useCallback((monthlyChoiceEffect?: MonthlyEffect) => {
    setGameState(prev => {
      const newMonth = prev.currentMonth === 12 ? 1 : prev.currentMonth + 1;
      const newYear = prev.currentMonth === 12 ? prev.currentYear + 1 : prev.currentYear;

      // Check if we've reached 2025 without a vaccine - player loses
      if (newYear > 2025) {
        return {
          ...prev,
          currentMonth: newMonth,
          currentYear: newYear,
          gameStatus: 'lost',
          monthlyEvents: [
            "Time's up! The 2025 deadline has passed without a vaccine. Humanity has failed."
          ],
        };
      }

      // If vaccine is already complete, trigger win on this next-month action
      if (prev.vaccineProgress >= 100) {
        return {
          ...prev,
          currentMonth: newMonth,
          currentYear: newYear,
          gameStatus: 'won',
          monthlyEvents: [
            "Vaccine completed! The world recovers."
          ],
        };
      }

      // Calculate infection spread and vaccine progress
      const totalAssignedDoctors = countries.reduce((sum, country) => sum + country.doctorsAssigned, 0);
      const hotspotCoverage = countries
        .filter(c => c.isHotspot)
        .reduce((sum, country) => sum + (country.doctorsAssigned > 0 ? 1 : 0), 0);

      // Random event impact - more volatile
      const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      const eventImpact = Math.random() * 15 - 5; // -5 to +10 (skewed toward negative outcomes, increased from 12 to 15)

      // Additional difficulty based on time progression
      const monthsElapsed = (newYear - 2021) * 12 + newMonth - 1;
      let timeDifficulty = 0;
      if (monthsElapsed > 12) {
        // After first year, infection becomes harder to control
        timeDifficulty = (monthsElapsed / 10); // Gradually increasing difficulty (from /12 to /10)
      }

      // Handle special events
      let doctorsLostThisMonth = 0;
      let vaccineSetback = false;
      
      if (randomEvent.includes("Doctor burnout")) {
        doctorsLostThisMonth = Math.floor(Math.random() * 2) + 1; // Lose 1 or 2 doctors
      }
      
      if (randomEvent.includes("Vaccine research setback")) {
        vaccineSetback = true;
      }

      // Vaccine progress
      // Now takes 84 months (7 years) instead of 72 months (6 years) to complete naturally
      const baseVaccineProgress = isFinite(monthsElapsed) ? (monthsElapsed / 60) * 100 : 0; 
      
      // Calculate vaccine boost from both research-committed doctors and field doctors
      const researchBoost = isFinite(prev.researchCommittedDoctors) ? (prev.researchCommittedDoctors || 0) * 1.2 : 0; // Each research doctor contributes 0.5% per month
      const fieldBoost = isFinite(totalAssignedDoctors) ? totalAssignedDoctors * 0.5 : 0; // Each field doctor contributes 0.2% per month
      let vaccineBoost = isFinite(researchBoost + fieldBoost) ? researchBoost + fieldBoost : 0;
      
      // Apply vaccine setback if the event occurred
      if (vaccineSetback) {
        vaccineBoost -= 7; // Significant setback (increased from 5 to 7)
      }
      
      // If anti-vaccination event, further reduce progress
      if (randomEvent.includes("Anti-vaccination")) {
        vaccineBoost -= 4; // Increased from 3 to 4
      }
      
      // Validate vaccine progress calculation
      const currentVaccineProgress = isFinite(prev.vaccineProgress) ? prev.vaccineProgress : 0;
      const progressChange = isFinite(baseVaccineProgress - currentVaccineProgress) ? (baseVaccineProgress - currentVaccineProgress) * 0.08 : 0;
      const boost = isFinite(vaccineBoost) ? vaccineBoost : 0;
      
      // Slower vaccine progress convergence (monotonic: never decrease)
      const computedVaccineProgress = clampToPercentage(currentVaccineProgress + progressChange + boost);
      let newVaccineProgress = Math.max(currentVaccineProgress, computedVaccineProgress);
      const vaccineDelta = Math.max(0, newVaccineProgress - currentVaccineProgress);

      // Update country infection levels with more dynamic changes
      const updatedCountries = countries.map(country => {
      // Calculate maximum doctors this country can support
      const maxDoctors = Math.ceil(country.importance / 20); // 1-5 doctors based on importance
      
      // Calculate doctor effectiveness based on allocation vs max capacity
      // If fully staffed (100% of max doctors), get maximum 50% infection reduction
      const doctorAllocationRatio = Math.max(0, country.doctorsAssigned / Math.max(1, maxDoctors));
      const maxInfectionReduction = 50; // Maximum 50% reduction when fully staffed
      const doctorEffect = doctorAllocationRatio * maxInfectionReduction * (country.isHotspot ? 1.2 : 1.0);
      
      // Infection spread now considers country importance more significantly
      const importanceFactor = Math.max(0.1, country.importance / 80); // Normalize importance with higher weight, ensure minimum
      
      // Country-specific infection volatility based on population and current infection
      const volatility = (country.population / 400) * (country.infectionLevel / 40) * (Math.random() * 18 - 8); // Increased volatility
      
      // Base infection spread with time difficulty and event impact
      const baseInfectionSpread = 15 + timeDifficulty + eventImpact; // Base spread rate
      
      // Ensure countries without doctors always have some infection increase
      const baseInfectionChange = (baseInfectionSpread * 0.8 * importanceFactor) - doctorEffect + volatility;
      const minimumIncrease = country.doctorsAssigned === 0 ? 2 : 0; // Minimum 2% increase if no doctors
      
      const infectionChange = Math.max(minimumIncrease, baseInfectionChange);
      
      // Validate all inputs before calculation
      const currentLevel = sanitizeNumber(country.infectionLevel, 0);
      const change = sanitizeNumber(infectionChange, minimumIncrease);
      
      const newInfectionLevel = clampToPercentage(currentLevel + change);

      // More significant and dynamic value and importance shifts
      // Countries with higher infection levels become more important (crisis response)
      const infectionImpact = (newInfectionLevel / 100) * 7; // Up to +7 importance based on infection (increased from 5)
      
      // Time-based fluctuations - different countries peak in importance at different times
      // More dramatic shifts with higher frequency
      const timeFactor = Math.sin((monthsElapsed + country.population % 18) / 9 * Math.PI) * 6; // Changed from 24/12/4 to 18/9/6
      
      // Random fluctuation component - more volatile
      const randomFluctuation = Math.random() * 8 - 4; // +/- 4 (increased from 6-3)
      
      // Economic value shifts based on infection level - countries with high infection see economic decline
      const economicImpact = newInfectionLevel > 60 ? -3 : newInfectionLevel > 40 ? -1 : 1;
      
      // Validate all calculations before applying
      const currentValue = sanitizeNumber(country.value, 50);
      const currentImportance = sanitizeNumber(country.importance, 50);
      
      const valueChange = sanitizeNumber(randomFluctuation + timeFactor + economicImpact, 0);
      const importanceChange = sanitizeNumber(infectionImpact + timeFactor + randomFluctuation, 0);
      
      const newValue = clampToPercentage(currentValue + valueChange);
      const newImportance = clampToPercentage(currentImportance + importanceChange);

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
    });

      // Calculate global infection as weighted average of country infection levels
      // Weight is based on strategic importance and economic value with population consideration
      let totalWeightedInfection = 0;
      let totalWeight = 0;
      
      updatedCountries.forEach(country => {
        // Sanitize all values
        const importance = sanitizeNumber(country.importance, 50);
        const value = sanitizeNumber(country.value, 50);
        const infectionLevel = sanitizeNumber(country.infectionLevel, 0);
        const population = sanitizeNumber(country.population, 100);
        
        // Weight combines strategic importance, economic value, and population
        // More important countries and larger populations have more influence
        const strategicWeight = (importance + value) / 2;
        const populationWeight = Math.log10(population) / 3; // Logarithmic scaling for population
        const weight = strategicWeight * (1 + populationWeight);
        
        // Ensure weight is valid and infection level is a number
        if (isFinite(weight) && isFinite(infectionLevel) && weight > 0) {
          totalWeightedInfection += infectionLevel * weight;
          totalWeight += weight;
        }
      });
      
      // Calculate global infection with proper validation
      let newGlobalInfection = 0;
      if (totalWeight > 0 && isFinite(totalWeightedInfection)) {
        newGlobalInfection = totalWeightedInfection / totalWeight;
      } else {
        // Fallback: simple average if weighted calculation fails
        const validInfections = updatedCountries
          .map(c => sanitizeNumber(c.infectionLevel, 0))
          .filter(level => level > 0);
        newGlobalInfection = validInfections.length > 0 
          ? validInfections.reduce((sum, level) => sum + level, 0) / validInfections.length
          : sanitizeNumber(prev.globalInfection, 20); // Keep current value if all calculations fail
      }
      
      // Ensure global infection is within valid range
      newGlobalInfection = clampToPercentage(newGlobalInfection);

      // Check lose condition only; win is handled at the start of next month when vaccine is complete
      let newGameStatus = prev.gameStatus;
      if (newGlobalInfection >= 90) { // Lower threshold for losing (from 95 to 90)
        newGameStatus = 'lost';
      }

      // Apply monthly choice effects if provided
      let choiceMessage = '';
      let newTotalDoctors = prev.totalDoctors;
      let newAvailableDoctors = prev.availableDoctors;
      
      if (monthlyChoiceEffect && isFinite(monthlyChoiceEffect.value)) {
        switch (monthlyChoiceEffect.type) {
          case 'researchBoost':
            newVaccineProgress = Math.min(100, newVaccineProgress + monthlyChoiceEffect.value);
            choiceMessage = `Strategic focus on research: +${monthlyChoiceEffect.value}% vaccine progress`;
            break;
          case 'addDoctors': {
            newTotalDoctors = prev.totalDoctors + monthlyChoiceEffect.value;
            newAvailableDoctors = calculateExpectedAvailableDoctors(newTotalDoctors, prev.researchCommittedDoctors || 0);
            choiceMessage = `Recruited ${monthlyChoiceEffect.value} new doctors`;
            break;
          }
          case 'spreadDecrease':
            newGlobalInfection = Math.max(0, newGlobalInfection - monthlyChoiceEffect.value);
            choiceMessage = `Strict lockdowns implemented: -${monthlyChoiceEffect.value}% global infection`;
            break;
          case 'spreadIncrease':
            newGlobalInfection = Math.min(100, newGlobalInfection + monthlyChoiceEffect.value);
            choiceMessage = `Restrictions relaxed: +${monthlyChoiceEffect.value}% global infection`;
            break;
          case 'loseDoctors': {
            newTotalDoctors = Math.max(0, prev.totalDoctors - monthlyChoiceEffect.value);
            newAvailableDoctors = calculateExpectedAvailableDoctors(newTotalDoctors, prev.researchCommittedDoctors || 0);
            choiceMessage = `Doctor fatigue: Lost ${monthlyChoiceEffect.value} doctor(s)`;
            break;
          }
        }
      }

      // Generate event message
      const eventMessages = [randomEvent];
      if (doctorsLostThisMonth > 0) {
        eventMessages.push(`Doctor burnout: Lost ${doctorsLostThisMonth} doctor(s).`);
      }
      if (vaccineSetback) {
        eventMessages.push("Vaccine research faced significant setbacks.");
      }
      if (choiceMessage) {
        eventMessages.push(choiceMessage);
      }

      // Generate new monthly choices for the next month
      const newMonthlyChoices = generateMonthlyChoices();

      // Update both countries and game state atomically
      setCountries(updatedCountries);
      
      return {
        ...prev,
        currentMonth: newMonth,
        currentYear: newYear,
        globalInfection: newGlobalInfection,
        vaccineProgress: newVaccineProgress,
        lastVaccineDelta: vaccineDelta,
        gameStatus: newGameStatus,
        monthlyEvents: eventMessages,
        pendingMonthlyChoices: newMonthlyChoices,
        totalDoctors: newTotalDoctors,
        availableDoctors: newAvailableDoctors,
      };
    });
  }, [countries, generateMonthlyChoices, calculateExpectedAvailableDoctors, clampToPercentage, sanitizeNumber]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'menu' }));
  }, []);

  const researchInvestment = useCallback((value: number = 0) => {
    if (value > 0) {
      setGameState(prev => ({
        ...prev,
        vaccineProgress: Math.min(100, prev.vaccineProgress + value),
      }));
    } else if (gameState.availableDoctors >= 1) {
      setGameState(prev => {
        const newResearchCommitted = (prev.researchCommittedDoctors || 0) + 1;
        const expectedAvailable = calculateExpectedAvailableDoctors(prev.totalDoctors, newResearchCommitted);
        return ({
          ...prev,
          researchCommittedDoctors: newResearchCommitted,
          availableDoctors: expectedAvailable,
        });
      });
    }
  }, [gameState.availableDoctors, calculateExpectedAvailableDoctors]);

  const researchRecall = useCallback(() => {
    if ((gameState.researchCommittedDoctors || 0) > 0) {
      setGameState(prev => {
        const newAvailableDoctors = calculateExpectedAvailableDoctors(prev.totalDoctors, 0);
        return ({
          ...prev,
          researchCommittedDoctors: 0,
          availableDoctors: newAvailableDoctors,
        });
      });
    }
  }, [gameState.researchCommittedDoctors, calculateExpectedAvailableDoctors]);

  const addDoctors = useCallback((num: number) => {
    setGameState(prev => {
      const newTotal = prev.totalDoctors + num;
      const expectedAvailable = calculateExpectedAvailableDoctors(newTotal, prev.researchCommittedDoctors || 0);
      return ({
        ...prev,
        availableDoctors: expectedAvailable,
        totalDoctors: newTotal,
        monthlyEvents: [...prev.monthlyEvents, `Recruited ${num} new doctors.`]
      });
    });
  }, [calculateExpectedAvailableDoctors]);

  const loseDoctors = useCallback((num: number) => {
    setGameState(prev => {
      const newTotal = Math.max(0, prev.totalDoctors - num);
      const expectedAvailable = calculateExpectedAvailableDoctors(newTotal, prev.researchCommittedDoctors || 0);
      return ({
        ...prev,
        availableDoctors: expectedAvailable,
        totalDoctors: newTotal,
        monthlyEvents: [...prev.monthlyEvents, `${num} doctors lost due to unforeseen circumstances.`]
      });
    });
  }, [calculateExpectedAvailableDoctors]);

  const increaseGlobalInfection = useCallback((value: number) => {
    setGameState(prev => ({
      ...prev,
      globalInfection: Math.min(100, prev.globalInfection + value),
      monthlyEvents: [...prev.monthlyEvents, `Global infection increased by ${value}% due to new challenges.`]
    }));
  }, []);

  const decreaseGlobalInfection = useCallback((value: number) => {
    setGameState(prev => ({
      ...prev,
      globalInfection: Math.max(0, prev.globalInfection - value),
      monthlyEvents: [...prev.monthlyEvents, `Global infection decreased by ${value}% due to effective measures.`]
    }));
  }, []);

  const clearPendingMonthlyChoices = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      pendingMonthlyChoices: [],
    }));
  }, []);

  // Validation function to ensure doctor counts are consistent
  const validateDoctorCounts = useCallback(() => {
    const expectedAvailableDoctors = calculateExpectedAvailableDoctors(gameState.totalDoctors, gameState.researchCommittedDoctors || 0);
    
    if (gameState.availableDoctors !== expectedAvailableDoctors) {
      console.warn(`Doctor count mismatch detected. Expected available: ${expectedAvailableDoctors}, actual: ${gameState.availableDoctors}`);
      
      setGameState(prev => ({
        ...prev,
        availableDoctors: Math.max(0, Math.min(expectedAvailableDoctors, prev.totalDoctors)),
      }));
    }
  }, [gameState.availableDoctors, gameState.totalDoctors, gameState.researchCommittedDoctors, calculateExpectedAvailableDoctors]);

  return {
    gameState,
    countries,
    startGame,
    allocateDoctor,
    recallDoctor,
    advanceMonth,
    resetGame,
    researchInvestment,
    researchRecall,
    validateDoctorCounts,
    addDoctors,
    loseDoctors,
    increaseGlobalInfection,
    decreaseGlobalInfection,
    clearPendingMonthlyChoices,
  };
};