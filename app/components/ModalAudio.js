import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useAudioPlayer } from '../hooks/useAudioPlayer'; // We'll create this hook
import LoadingText from './LoadingText';

const ModalAudio = ({ audioBase64, isLoading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { playSound, stopSound } = useAudioPlayer(audioBase64);

  const handlePlayPress = async () => {
    if (isPlaying) {
      await stopSound();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await playSound();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.audioContainer}>
      {isLoading ? (
        <LoadingText text="Loading Audio..." />
      ) : (
        <TouchableOpacity onPress={handlePlayPress} disabled={!audioBase64}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color={audioBase64 ? colors.utilityGrey : colors.disabledGrey}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  audioContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.translationPopup.audioModuleShade,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default ModalAudio;