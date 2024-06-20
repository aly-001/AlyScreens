import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import WidgetHeader from './WidgetHeader';
import borderRadius from '../config/borderRadius';
import margins from '../config/margins';
import shadows from '../config/shadows';
import colors from '../config/colors';

export default function StatBox({header, value, valueColor="#000"}) {
  return (
    <View style={styles.container}>
      <WidgetHeader text={header} />
      <View style={styles.valueContainer}>
        <Text style={[ {color: colors.widgetHeader}, styles.value ]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: margins.homeScreenWidgets/2,
    height: 190,
    backgroundColor: 'white',
    borderRadius: borderRadius.homeScreenWidgets,

    shadowColor: shadows.homeScreenWidgets.shadowColor,
    shadowOffset: shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: shadows.homeScreenWidgets.shadowRadius,
    elevation: shadows.homeScreenWidgets.elevation,
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial',
    fontSize: 50,
    position: 'absolute',
    fontWeight: 'bold',
    opacity: .5,
  }
});
