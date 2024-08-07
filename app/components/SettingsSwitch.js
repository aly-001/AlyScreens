import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SettingSwitch = ({ label, value, onValueChange, disabled = false }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
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
});

export default SettingSwitch;