import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../config/colors';
const SettingSwitch = ({ label, value, onValueChange, disabled = false, onEdit }) => {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controlsContainer}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Feather name="edit-2" size={20} color={colors.appleBlue} />
          </TouchableOpacity>
        )}
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 48,
  },
  label: {
    fontSize: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
  },
});

export default SettingSwitch;