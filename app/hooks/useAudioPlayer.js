import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const useAudioPlayer = (audioBase64) => {
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    if (!audioBase64) {
      console.log('No audio data available');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${audioBase64}` },
        { shouldPlay: true }
      );
      setSound(newSound);

      await newSound.playAsync();
      console.log('Audio playback started');
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      console.log('Audio playback stopped');
    }
  };

  return { playSound, stopSound };
};