import { View, StyleSheet, Text } from 'react-native';
import React from 'react';

export default function LLMKeyScreen({}) {
  return (
    <View style={styles.container}>
      <Text>LLM Key Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  }
});
