import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import PracticeStartButton from "../../components/PracticeStartButton";

const WelcomeScreen = ({ onClickStart }) => {
  const fullText = 'Welcome to Aly!';
  const [displayedText, setDisplayedText] = useState('');
  const [showButton, setShowButton] = useState(false);

  // Animated values
  const opacity = useState(new Animated.Value(0))[0];
  const bgColorAnim = useState(new Animated.Value(0))[0]; // Background color animation
  const textOpacity = useState(new Animated.Value(1))[0]; // New animated value for text opacity

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, currentIndex + 1));
      currentIndex += 1;
      if (currentIndex === fullText.length) {
        clearInterval(interval);
        // Start background color and button opacity animations
        Animated.parallel([
          Animated.timing(bgColorAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false, // Background color doesn't support native driver
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowButton(true);
        });
      }
    }, 50); // Adjust the speed of the text animation here

    return () => clearInterval(interval);
  }, []);

  // Interpolate background color from white to grey
  const backgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#808080'], // White to Grey
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.Text style={[styles.welcomeText, { opacity: textOpacity }]}>
        {displayedText}
      </Animated.Text>
      {showButton && (
        <Animated.View style={{ opacity }}>
          <PracticeStartButton text="Start" width={120} deactivated={false} onPress={onClickStart} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Initial background color
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
