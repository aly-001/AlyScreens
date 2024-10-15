import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../config/colors';

const HelpScreen = () => {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.homeScreenBackground }]}>
      <Text style={[styles.title, { color: colors.text }]}>Help</Text>
      <Text style={[styles.content, { color: colors.text }]}>
        {/* Add your help content here */}
        This is the Help Screen. Here you can find troubleshooting steps and FAQs.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HelpScreen;