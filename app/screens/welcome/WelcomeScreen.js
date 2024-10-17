import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Linking, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PracticeStartButton from '../../components/PracticeStartButton';
import { useThemeColors } from '../../config/colors';

const WelcomeScreen = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const colors = useThemeColors();

  const handleSubmit = async () => {
    if (apiKey.trim()) {
      // Implement your API key validation and storage logic here
      onApiKeySet();
    } else {
      Alert.alert('Error', 'Please enter a valid API key');
    }
  };

  const openOpenAIPlatform = () => {
    Linking.openURL("https://platform.openai.com/api-keys").catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.homeScreenBackground }]}>
      <View style={styles.logoContainer}>

      </View>
      <Text style={[styles.title, { color: colors.text }]}>Welcome to Aly!</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>To get started, paste your OpenAI API key below</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { borderColor: colors.utilityGrey, color: colors.text }]}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter your OpenAI API key"
          placeholderTextColor={colors.utilityGrey}
        />
        <TouchableOpacity onPress={toggleHelp} style={styles.infoIcon}>
          <FontAwesome name="question-circle" size={24} color={colors.appleBlue} />
        </TouchableOpacity>
      </View>

      <PracticeStartButton
        text="Start"
        onPress={handleSubmit}
        deactivated={!apiKey.trim()}
        width={200}
      />

      {showHelp && (
        <View style={styles.helpSection}>
          <Text style={[styles.helpHeader, { color: colors.text }]}>API Key Setup</Text>
          <Text style={[styles.helpContent, { color: colors.text }]}>
            1. Sign in or create an account on OpenAI Platform.
            2. Verify your phone number, if needed.
            3. Click on "Create New Secret Key" and name it.
            4. Save your key securely.
            5. Navigate to Settings → Organization → Billing.
            6. Add your payment details, if required.
            7. Purchase credits. $10 worth should last a few months.
            8. Paste your key here and press "Start".
          </Text>
          <TouchableOpacity
            style={[styles.helpButton, { backgroundColor: colors.buttonBackground }]}
            onPress={openOpenAIPlatform}
          >
            <Text style={[styles.helpButtonText, { color: colors.highlightColor }]}>Open OpenAI Platform</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.disclaimer, { color: colors.utilityGrey }]}>
        Note: Your API key is stored securely on your device and is not shared with anyone.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  infoIcon: {
    marginLeft: 10,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  helpSection: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  helpHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  helpContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  helpButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  helpButtonText: {
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;