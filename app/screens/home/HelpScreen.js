import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";

import { useThemeColors } from "../../config/colors";

const HelpScreen = () => {
  const colors = useThemeColors();

  const openOpenAIPlatform = () => {
    Linking.openURL("https://platform.openai.com/api-keys").catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const openVideoLink = () => {
    Linking.openURL(
      "https://drive.google.com/file/d/1maN375YMhuC_oRqR9Wq50YZyra6h631Q/view?usp=sharing"
    ).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.homeScreenBackground },
      ]}
    >
      {/* Troubleshooting Section */}
      <Text style={[styles.header, { color: colors.text }]}>
        <Text style={styles.bold}>Troubleshooting</Text>
      </Text>

      {/* Issue 1 */}
      <View style={styles.indentedSection}>
        <Text style={[styles.subheader, { color: colors.text }]}>
          <Text style={styles.bold}>Tapping on words doesn't work</Text>
        </Text>
        <View style={styles.indentedContent}>
          <Text style={[styles.content, { color: colors.text }]}>
            1. <Text style={styles.bold}>Check your internet connection.</Text>{" "}
            Definitions and flashcard generation only work when your device is
            connected to the internet.
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            2.{" "}
              Ensure your <Text style={styles.bold}>OpenAI API key is properly set up
            </Text>{" "}
            and it <Text style={styles.bold}>has enough credits</Text>.
          </Text>
        </View>
      </View>

      {/* Issue 2 */}
      <View style={styles.indentedSection}>
        <Text style={[styles.subheader, { color: colors.text }]}>
          <Text style={styles.bold}>Book uploads aren't working</Text>
        </Text>
        <View style={styles.indentedContent}>
          <Text style={[styles.content, { color: colors.text }]}>
            -{" "}
            Ensure the book is in <Text style={styles.bold}>EPUB format.</Text>{" "}
            This is the only format currently supported by Aly.
          </Text>
        </View>
      </View>

      {/* API Key Setup Section */}
      <Text style={[styles.header, { color: colors.text }]}>
        <Text style={styles.bold}>API Key Setup</Text>
      </Text>
      <View style={styles.indentedSection}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonBackground }]}
          onPress={openOpenAIPlatform}
        >
          <Text style={[styles.buttonText, { color: colors.highlightColor }]}>
            <Text style={styles.bold}>Open OpenAI Platform</Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.indentedContent}>
          <Text style={[styles.content, { color: colors.text }]}>
            1. <Text style={styles.bold}>Sign in or create an account.</Text>
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            2. <Text style={styles.bold}>Verify your phone number</Text>, if
            needed.
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            3. Click on <Text style={styles.bold}>"Create New Secret Key"</Text>{" "}
            and name it as you like.
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            4. <Text style={styles.bold}>Save your key securely.</Text> For
            example, email it to yourself.
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            5.{" "}
            
              Navigate to <Text style={styles.bold}>Settings → Organization → Billing.
            </Text>
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            6. <Text style={styles.bold}>Add your payment details</Text>, if
            required.
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            7. <Text style={styles.bold}>Purchase credits.</Text> Without image
            generation, $10 worth of credits should last a few months.
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            8. <Text style={styles.bold}>Open Aly</Text> on your mobile device.
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            9.{" "}
 
              Go to <Text style={styles.bold}>Settings → Configure AI Key → Manage your API key.
            </Text>
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            10. <Text style={styles.bold}>Paste your key</Text> into the form{" "}
            and press <Text style={styles.bold}>"Save".</Text>
          </Text>
          <Text style={[styles.content, { color: colors.text }]}>
            11. You're all set!
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.buttonBackground }]}
            onPress={openVideoLink}
        >
          <Text style={[styles.buttonText, { color: colors.highlightColor }]}>
            <Text style={styles.bold}>Watch Tutorial</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Watch Video Link */}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 70,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  indentedSection: {
    marginLeft: 16,
  },
  indentedContent: {
    marginLeft: 16,
  },
});

export default HelpScreen;
