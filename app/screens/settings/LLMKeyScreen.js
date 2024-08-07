import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import colors from '../../config/colors';

export default function LLMKeyScreen({}) {
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 500, color:  colors.utilityGreyLight}}>LLM Key Screen</Text>
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
