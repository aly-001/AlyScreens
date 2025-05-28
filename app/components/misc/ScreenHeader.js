import { View, StyleSheet , Text} from 'react-native';
import React from 'react';
import fonts from '../../config/fonts';
import layout from '../../config/layout';
import { useThemeColors } from '../../config/colors';

export default function ScreenHeader({ text }) {
  const  colors  = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.header, {color: colors.screenHeader}]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    top: layout.margins.screenHeaderMarginTop,
  },
  header:{
    margin: layout.margins.screenHeaderMargin,
    fontSize: layout.fontSize.ScreenHeader,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.main,
  }
});
