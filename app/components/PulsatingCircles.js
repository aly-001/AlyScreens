import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import colors from '../config/colors';

const PulsatingCircles = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulsate = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ]);

    Animated.loop(pulsate).start();
    return () => scaleAnim.stopAnimation();
  }, []);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }]
  };

  return (
    <View style={styles.container}>
      <View style={styles.greyBox} />
      <View style={styles.circlesContainer}>
        <View style={styles.row}>
          <Animated.View style={[styles.circle, animatedStyle]} />
          <Animated.View style={[styles.circle, animatedStyle]} />
        </View>
        <View style={styles.row}>
          <Animated.View style={[styles.circle, animatedStyle]} />
          <Animated.View style={[styles.circle, animatedStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greyBox: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: colors.utilityGrey,
    borderRadius: 4,
    opacity: .95,
  },
  circlesContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    margin: 0,
  },
});

export default PulsatingCircles;