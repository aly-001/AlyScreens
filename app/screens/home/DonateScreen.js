import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import colors from '../../config/colors';
import PracticeStartButton from '../../components/PracticeStartButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const DonateScreen = () => {
  const handleDonatePress = () => {
    const url = 'https://buymeacoffee.com/amacken007';
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <PracticeStartButton text="Buy us a coffee" onPress={handleDonatePress} width={240} hearts={true} />
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
  heartContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -25, // Half of the heart size to center it
  },
  heart: {
    marginHorizontal: 10,
  },
});

export default DonateScreen;
