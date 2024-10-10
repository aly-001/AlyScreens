import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ViewStack({ children }) {
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / SCREEN_WIDTH);
    scrollViewRef.current.scrollTo({ x: currentIndex * SCREEN_WIDTH, animated: true });
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleScroll}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      style={styles.container}
    >
      {children.map((child, index) => {
        // Removed inputRange and opacity interpolation
        return (
          <Animated.View key={index} style={[styles.card, { opacity: 1 }]}>
            {child}
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
});