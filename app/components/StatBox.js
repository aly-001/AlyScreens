import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import WidgetHeader from './WidgetHeader';
import layout from '../config/layout';
import { useThemeColors } from '../config/colors';
export default function StatBox({header, value, valueColor="#000"}) {
  const colors = useThemeColors();
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
    marginHorizontal: layout.margins.homeScreenWidgets/2,
    height: 190,
    backgroundColor: 'white',
    borderRadius: layout.borderRadius.homeScreenWidgets,

    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
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
