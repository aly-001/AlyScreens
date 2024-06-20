import { View, StyleSheet , Text} from 'react-native';
import React from 'react';
import fonts from '../config/fonts';
import colors from '../config/colors';

export default function HomeHeader({}) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
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
    color: colors.homeHeader,
    fontFamily: fonts.main,
  }
});
