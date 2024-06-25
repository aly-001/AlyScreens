import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Animated, Dimensions, StyleSheet } from 'react-native';
import colors from '../config/colors';

const BookHiddenFooter = ({ style, progress }) => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const footerWidth = (progress / 100) * screenWidth;

  return (
    <Animated.View style={[styles.hiddenFooterContainer, style, { width: footerWidth }]}>
      <SafeAreaView>
        <View style={styles.hiddenFooter}>
          {/* Add your footer content here */}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hiddenFooterContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    backgroundColor: colors.utilityGreyLight,
    zIndex: 2,
  },
  hiddenFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 10,
  },
});

export default BookHiddenFooter;