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

  const openGutenberg = () => {
    Linking.openURL("https://www.gutenberg.org/").catch((err) =>
      console.error("Failed to open URL:", err)
    );
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
            - <Text style={styles.bold}>Check your internet connection.</Text>{" "}
            Definitions and flashcard generation only work when your device is
            connected to the internet.
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
            - Ensure the book is in{" "}
            <Text style={styles.bold}>EPUB format.</Text> This is the only
            format currently supported by Aly.
          </Text>
        </View>
      </View>

      {/* How to upload books Section */}
      <Text style={[styles.header, { color: colors.text }]}>
        <Text style={styles.bold}>How to upload books</Text>
      </Text>
      <View style={styles.indentedSection}>
        <Text style={[styles.content, { color: colors.text }]}>
          1. Head over to Project Gutenberg to download free EPUB books:
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonBackground }]}
          onPress={openGutenberg}
        >
          <Text style={[styles.buttonText, { color: colors.highlightColor }]}>
            Open Project Gutenberg
          </Text>
        </TouchableOpacity>
        <Text style={[styles.content, { color: colors.text }]}>
          2. <Text style={styles.bold}>Download a book</Text> to your device in <Text style={styles.bold}>.epub format</Text>.
        </Text>
        <Text style={[styles.content, { color: colors.text }]}>
          3. Open Aly, go to <Text style={styles.bold}>library</Text>, then click <Text style={styles.bold}>upload</Text>.
        </Text>
        <Text style={[styles.content, { color: colors.text }]}>
          4. Go to <Text style={styles.bold}>browse</Text>. If necessary, click the <Text style={styles.bold}>back arrow on the top left</Text> of the browse window.
        </Text>
        <Text style={[styles.content, { color: colors.text }]}>
          5. Find your downloaded book and <Text style={styles.bold}>select it</Text>.
        </Text>
        <Text style={[styles.content, { color: colors.text }]}>
          6. You're good to go! You can now open the book by clicking on it from the library screen or from the homepage.
        </Text>
      </View>

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
