import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Animated, Dimensions, StyleSheet } from 'react-native';
import colors from '../config/colors';

const BookHiddenFooter = ({ style, progress, color }) => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const footerWidth = (progress / 100) * screenWidth;

  return (
    <Animated.View style={[styles.hiddenFooterContainer, style, { backgroundColor: color }]}>
      <SafeAreaView>
        <View style={[styles.hiddenFooter]}>
          {/* Add your footer content here */}
          <View style={[styles.status, {width: footerWidth}]}></View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hiddenFooterContainer: {
    position: "absolute",
    bottom: 74,
    left: 0,
    right: 0,
    zIndex: 2,
    opacity: .2,
  },
  hiddenFooter: {
    backgroundColor: "white",
    opacity: 0.35,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  status:{
    flex: 1,
    backgroundColor: "black",
    opacity: 0.45,
  }
});

export default BookHiddenFooter;