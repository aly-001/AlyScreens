import { View, StyleSheet , Text} from 'react-native';
import React from 'react';
import fonts from '../config/fonts';
import colors from '../config/colors';

export default function ScreenHeader({ text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
  header:{
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.screenHeader,
    fontFamily: fonts.main,
  }
});
