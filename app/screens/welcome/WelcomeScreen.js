import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Linking, 
  Animated, 
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAPIKey } from "../../context/APIKeyContext";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from '../../config/colors';

const WelcomeScreen = ({ onApiKeySet }) => {
  const colors = useThemeColors();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const [apiKey, setApiKey] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showBlank, setShowBlank] = useState(true);
  const { updateAPIKey } = useAPIKey();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBlank(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 500);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  useEffect(() => {
    setIsButtonEnabled(apiKey.trim().length > 0);
  }, [apiKey]);

  const handleSubmit = async () => {
    if (apiKey.trim()) {
      const success = await updateAPIKey(apiKey.trim());
      if (success) {
        onApiKeySet();
      } else {
        Alert.alert('Error', 'Failed to save API key. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid API key');
    }
  };

  const handleInfoPress = () => {
    Alert.alert(
      "OpenAI API Key",
      "To obtain your OpenAI API key, please visit the OpenAI platform.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Visit OpenAI Platform",
          onPress: () => Linking.openURL("https://platform.openai.com/api-keys"),
        },
      ],
      { cancelable: false }
    );
  };

  if (showBlank) {
    return <View style={[styles.blankScreen, { backgroundColor: colors.readScreen.primary }]} />;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: colors.readScreen.primary }]}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>To get started, paste your OpenAI API key below</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { borderColor: colors.utilityGrey }]}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your OpenAI API key"
          />
          <TouchableOpacity onPress={handleInfoPress} style={styles.infoIcon}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.appleBlue}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.button, !isButtonEnabled && styles.buttonDisabled, { backgroundColor: isButtonEnabled ? colors.appleBlue : colors.utilityGrey }]}
          onPress={handleSubmit}
          disabled={!isButtonEnabled}
        >
          <Text style={[styles.buttonText, !isButtonEnabled && styles.buttonTextDisabled]}>Start</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle2}>The key is stored securely on your device, and does not leave your device.</Text>
        <Text style={[styles.disclaimer, { color: colors.utilityGrey }]}>
          Note: While we utilize the OpenAI API, we are not endorsed,
          sponsored by, or affiliated with OpenAI. We're an independent
          application striving to provide value through AI technology.
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  blankScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  subtitle2: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    color: "red",
  },
  inputContainer: {
    width: '100%',
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
  button: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    width: "70%",
    marginTop: 40,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default WelcomeScreen;
