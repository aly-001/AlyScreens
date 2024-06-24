import { View, StyleSheet } from 'react-native';
import React from 'react';

export default function Pointer({}) {
  return (
      <View style={styles.cover}>

      </View>
  );
}

const styles = StyleSheet.create({
  cover:{
    height: 20,
    width: 20,
    backgroundColor: 'dodgerblue',
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  }
});