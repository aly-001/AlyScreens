import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColors } from '../../config/colors';

const LoadingText = ({ text, barColor = '#fff', textColor, speed = 1000, barWidth = 30 }) => {
  const colors = useThemeColors();
  const [textWidth, setTextWidth] = useState(0);
  const barPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateBar = () => {
      Animated.loop(
        Animated.timing(barPosition, {
          toValue: textWidth - barWidth,
          duration: speed,
          useNativeDriver: false,
        })
      ).start();
    };

    if (textWidth > 0) {
      animateBar();
    }

    return () => barPosition.stopAnimation();
  }, [barPosition, speed, textWidth, barWidth]);

  const handleTextLayout = (event) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  // Helper function to add alpha channel to hex color
  const addAlpha = (color, opacity) => {
    // Remove # if present
    const hex = color.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return rgba color string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <View>
      <Text
        style={{ color: colors.utilityGrey, fontWeight: '600', fontSize: 20 }}
        onLayout={handleTextLayout}
      >
        {text}
      </Text>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          width: barWidth,
          transform: [{ translateX: barPosition }],
        }}
      >
        <AnimatedLinearGradient
          colors={[addAlpha(barColor, 0), barColor, barColor, addAlpha(barColor, 0)]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export default LoadingText;