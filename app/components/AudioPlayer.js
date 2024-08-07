import React, { useState, useEffect } from 'react';
import { View, Button, ActivityIndicator, Text } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayer = ({ audioBase64, isLoading }) => {
  const [sound, setSound] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    setError(null);
    console.log('Loading Sound');
    if (!audioBase64) {
      console.log('No audio data available');
      setError('No audio data available');
      return;
    }

    try {
      console.log('Audio base64 length:', audioBase64.length);
      
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${audioBase64}` },
        { shouldPlay: true }
      );
      setSound(newSound);

      console.log('Sound created:', status);

      await newSound.playAsync();
      console.log('Audio playback started');

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log('Audio playback finished');
        }
      });
    } catch (err) {
      console.error('Error playing sound:', err);
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <>
          <Button title="Play Audio" onPress={playSound} disabled={!audioBase64} />
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </>
      )}
    </View>
  );
};

export default AudioPlayer;