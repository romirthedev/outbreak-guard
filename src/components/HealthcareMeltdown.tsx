import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';

import { StartScreen } from '@/components/StartScreen';
import { MonthlyChoiceModal } from '@/components/MonthlyChoiceModal';
import { GameHUD } from '@/components/GameHUD';
import { WorldMap } from '@/components/WorldMap';
import { GameOverScreen } from '@/components/GameOverScreen';
import { HowToPlayScreen } from '@/components/HowToPlayScreen';





export const HealthcareMeltdown = () => {
  const [showMonthlyChoice, setShowMonthlyChoice] = useState(false);
  const [monthlyChoiceOptions, setMonthlyChoiceOptions] = useState<any[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const {
    gameState,
    countries,
    startGame,
    allocateDoctor,
    recallDoctor,
    advanceMonth,
    resetGame,
    researchInvestment,
    addDoctors,
    loseDoctors,
    increaseGlobalInfection,
    decreaseGlobalInfection,
  } = useGameState();

  const handleStartGame = () => {
    setShowHowToPlay(false);
    startGame();
  };

  const handleHowToPlay = () => {
    setShowHowToPlay(true);
  };

  const handleBackFromHowToPlay = () => {
    setShowHowToPlay(false);
  };

  const handleAdvanceMonth = () => {
    // Generate random options for the user
    const options = [
      { id: 'option1', text: 'Focus on Vaccine Research (Research Boost)', effect: { type: 'researchBoost', value: 10 } },
      { id: 'option2', text: 'Recruit More Doctors (+2 Doctors)', effect: { type: 'addDoctors', value: 2 } },
      { id: 'option3', text: 'Implement Strict Lockdowns (Spread Decrease)', effect: { type: 'spreadDecrease', value: 5 } },
      { id: 'option4', text: 'Relax Restrictions (Spread Increase)', effect: { type: 'spreadIncrease', value: 8 } },
      { id: 'option5', text: 'Doctor Fatigue (Lose 1 Doctor)', effect: { type: 'loseDoctors', value: 1 } },
    ];
    const numOptions = Math.floor(Math.random() * 4) + 2; // 2 to 5 options
    const shuffled = options.sort(() => 0.5 - Math.random());
    setMonthlyChoiceOptions(shuffled.slice(0, numOptions));
    setShowMonthlyChoice(true);
  };

  const handleChoiceSelected = (effect: any) => {
    setShowMonthlyChoice(false);
    // Apply the effect based on the choice
    switch (effect.type) {
      case 'researchBoost':
        researchInvestment(effect.value); // Assuming researchInvestment can take a value
        break;
      case 'addDoctors':
        addDoctors(effect.value);
        break;
      case 'spreadDecrease':
        decreaseGlobalInfection(effect.value);
        break;
      case 'spreadIncrease':
        increaseGlobalInfection(effect.value);
        break;
      case 'loseDoctors':
        loseDoctors(effect.value);
        break;
      default:
        break;
    }
    advanceMonth(); // Then advance the month as usual
  };

  const handleReturnToMenu = () => {
    setShowHowToPlay(false);
    resetGame();
  };

  // Show How to Play screen
  if (showHowToPlay) {
    return <HowToPlayScreen onBack={handleBackFromHowToPlay} />;
  }

  // Show start screen
  if (gameState.gameStatus === 'menu') {
    return (
      <StartScreen 
        onStartGame={handleStartGame} 
        onHowToPlay={handleHowToPlay}
      />
    );
  }

  // Show game over screen
  if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
    return (
      <GameOverScreen
        isVictory={gameState.gameStatus === 'won'}
        finalMonth={gameState.currentMonth}
        finalYear={gameState.currentYear}
        finalInfection={gameState.globalInfection}
        vaccineProgress={gameState.vaccineProgress}
        onPlayAgain={handleStartGame}
        onReturnToMenu={handleReturnToMenu}
      />
    );
  }

  // Show monthly choice modal
  if (showMonthlyChoice) {
    return (
      <MonthlyChoiceModal
        options={monthlyChoiceOptions}
        onChoiceSelected={handleChoiceSelected}
      />
    );
  }

  // Show main game screen
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <GameHUD
        availableDoctors={gameState.availableDoctors}
        totalDoctors={gameState.totalDoctors}
        currentMonth={gameState.currentMonth}
        currentYear={gameState.currentYear}
        globalInfection={gameState.globalInfection}
        vaccineProgress={gameState.vaccineProgress}
        onAdvanceMonth={handleAdvanceMonth} // Use the new handler
        onResearchInvestment={researchInvestment}
      />
      
      <div className="flex-1 relative">
        <WorldMap
          countries={countries}
          onAllocateDoctor={allocateDoctor}
          onRecallDoctor={recallDoctor}
          availableDoctors={gameState.availableDoctors}
        />
        
        {/* Monthly Events Display */}
        {gameState.monthlyEvents.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
              <span className="text-primary-glow mr-2">📢</span>
              Monthly Update
            </h4>
            <p className="text-sm text-muted-foreground">
              {gameState.monthlyEvents[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};