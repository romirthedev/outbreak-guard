import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { StartScreen } from '@/components/StartScreen';
import { GameHUD } from '@/components/GameHUD';
import { WorldMap } from '@/components/WorldMap';
import { GameOverScreen } from '@/components/GameOverScreen';
import { HowToPlayScreen } from '@/components/HowToPlayScreen';

export const HealthcareMeltdown = () => {
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
        onAdvanceMonth={advanceMonth}
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