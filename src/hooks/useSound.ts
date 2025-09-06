import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playSound = useCallback((soundName: string, duration?: number) => {
    try {
      // Create audio element if it doesn't exist
      if (!audioRefs.current[soundName]) {
        audioRefs.current[soundName] = new Audio(`/${soundName}.mp3`);
        audioRefs.current[soundName].preload = 'auto';
      }

      const audio = audioRefs.current[soundName];
      
      // Reset audio to beginning
      audio.currentTime = 0;
      
      // Play the sound
      audio.play().catch((error) => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });

      // Stop after specified duration if provided
      if (duration) {
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, duration * 1000);
      }
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error);
    }
  }, []);

  const stopSound = useCallback((soundName: string) => {
    if (audioRefs.current[soundName]) {
      audioRefs.current[soundName].pause();
      audioRefs.current[soundName].currentTime = 0;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    playSound,
    stopSound,
    stopAllSounds,
  };
};
