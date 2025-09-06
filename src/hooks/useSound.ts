import { useCallback, useRef, useEffect } from 'react';

export const useSound = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear all timeouts
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
      
      // Pause and cleanup all audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

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
        const timeout = setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          timeoutsRef.current.delete(timeout);
        }, duration * 1000);
        timeoutsRef.current.add(timeout);
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
