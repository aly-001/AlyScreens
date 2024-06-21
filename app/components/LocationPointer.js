import { View, StyleSheet } from 'react-native';
import React from 'react';

export default function LocationPointer({location}) {
  const top = location.top + location.height * 2 + 5;
  const left = location.left + location.width / 2 + 15;
  return (
    <View style={[ styles.container, {top: top, left: left} ]}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: 10,
    backgroundColor: 'dodgerblue',
    position: 'absolute',
  }
});
