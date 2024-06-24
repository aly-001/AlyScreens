import { View, StyleSheet } from 'react-native';
import React from 'react';

export default function Pointer({}) {
  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  }
});