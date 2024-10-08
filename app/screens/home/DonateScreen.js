import React from 'react';
import { View, Button, StyleSheet, Linking } from 'react-native';
import colors from '../../config/colors';

const DonateScreen = () => {
  const handleDonatePress = () => {
    const url = 'https://patreon.com/aly_reader';
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <Button
        title="Donate Now"
        onPress={handleDonatePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DonateScreen;
