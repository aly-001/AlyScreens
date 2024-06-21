import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const MagnificentCheckmark = ({ size = 40, color = '#4CAF50', strokeWidth = 3, checked = false }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: checked ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.65, 0, 0.35, 1),
      useNativeDriver: true,
    }).start();
  }, [checked]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [63.6, 0], // Length of the path
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <AnimatedPath
          d="M3 12l6 6L21 6"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={63.6} // Length of the path
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MagnificentCheckmark;