import { View, StyleSheet , Text} from 'react-native';
import React from 'react';
import fonts from '../config/fonts';
import colors from '../config/colors';
import layout from '../config/layout';

export default function ScreenHeader({ text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  header:{
    margin: layout.margins.screenHeaderMargin,
    fontSize: layout.fontSize.ScreenHeader,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.screenHeader,
    fontFamily: fonts.main,
  }
});
