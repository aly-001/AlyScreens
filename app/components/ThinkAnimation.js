import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ThinkAnimation = () => {
  const opacity1 = new Animated.Value(0);
  const opacity2 = new Animated.Value(0);
  const opacity3 = new Animated.Value(0);
  const opacity4 = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity1, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity2, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity3, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity4, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.square, styles.square1, { opacity: opacity1 }]} />
      <Animated.View style={[styles.square, styles.square2, { opacity: opacity2 }]} />
      <Animated.View style={[styles.square, styles.square3, { opacity: opacity3 }]} />
      <Animated.View style={[styles.square, styles.square4, { opacity: opacity4 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 50,
    height: 50,
    margin: 10,
  },
  square1: { backgroundColor: 'red' },
  square2: { backgroundColor: 'green' },
  square3: { backgroundColor: 'blue' },
  square4: { backgroundColor: 'yellow' },
});

export default ThinkAnimation;