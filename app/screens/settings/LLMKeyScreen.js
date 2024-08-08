import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import colors from '../../config/colors';

export default function LLMKeyScreen({}) {
  return (
    <View>
      <Text>Head over to https://platform.openai.com/api-keys to get your key</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.homeScreenBackground,
  }
});
