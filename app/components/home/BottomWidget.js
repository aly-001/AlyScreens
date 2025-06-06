import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import WidgetHeader from './WidgetHeader';
import layout from '../../config/layout';
import { useThemeColors } from '../../config/colors';

export default function BottomWidget({ header, IconComponent, iconColor = 'lightgrey', onPress, style }) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity 
      style={[styles.container, style, {backgroundColor: colors.mainComponentBackground,}]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <WidgetHeader text={header} />
      <View style={styles.iconContainer}>
        {IconComponent && <IconComponent color={colors.bottomWidgetIcon} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.margins.homeScreenWidgets / 2,
    height: 190,
    borderRadius: layout.borderRadius.homeScreenWidgets,
    borderTopEndRadius: layout.borderRadius.homeScreenWidgetsSandwich,
    borderTopStartRadius: layout.borderRadius.homeScreenWidgetsSandwich,
    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial',
    fontSize: 50,
    position: 'absolute',
    fontWeight: 'bold',
    opacity: 0.5,
  }
});