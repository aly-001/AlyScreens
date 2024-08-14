import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking, Animated } from 'react-native';
import { useAPIKey } from "../../context/APIKeyContext";
import { Ionicons } from "@expo/vector-icons";
import colors from '../../config/colors';

const WelcomeScreen = ({ onApiKeySet }) => {
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
    return <View style={styles.blankScreen} />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>To get started, paste your OpenAI API key below</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter your OpenAI API key"
          secureTextEntry
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
        style={[styles.button, !isButtonEnabled && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isButtonEnabled}
      >
        <Text style={[styles.buttonText, !isButtonEnabled && styles.buttonTextDisabled]}>Start</Text>
      </TouchableOpacity>
      <Text style={styles.disclaimer}>
        Note: While we utilize the OpenAI API, we are not endorsed,
        sponsored by, or affiliated with OpenAI. We're an independent
        application striving to provide value through AI technology.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blankScreen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: colors.utilityGrey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  infoIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: colors.appleBlue,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.utilityGrey,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#A9A9A9',
  },
  disclaimer: {
    width: "60%",
    marginTop: 40,
    fontSize: 12,
    color: colors.utilityGrey,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default WelcomeScreen;