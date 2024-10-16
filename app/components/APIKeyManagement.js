import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useAPIKey } from "../context/APIKeyContext";
import { useThemeColors } from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import layout from "../config/layout";

const APIKeyManagement = () => {
  const colors = useThemeColors();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newKey, setNewKey] = useState("");
  const { apiKey, updateAPIKey, removeAPIKey } = useAPIKey();

  const PromptEditModal = ({ isVisible, onClose }) => {
    const [key, setKey] = useState("");

    const handleSave = async () => {
      if (key) {
        console.log("KEY");
        const success = await updateAPIKey(key);
        if (success) {
          console.log("Success!!");
          Alert.alert("Success", "API Key updated");
          console.log("newKey", newKey);
          setNewKey("");
          onClose();
        } else {
          console.log("failure");
          onClose();
        }
      } else {
        Alert.alert("Error", "Please enter a key");
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
            onPress: () =>
              Linking.openURL("https://platform.openai.com/api-keys"),
          },
        ],
        { cancelable: false }
      );
    };

    return (
      <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.centeredView, {backgroundColor: colors.modalBackground}]}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={[styles.modalView, { backgroundColor: colors.mainComponentBackground }]}>
              <View style={styles.greyPartContainer}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Manage API Key</Text>
                <TouchableOpacity
                  onPress={handleInfoPress}
                  style={styles.infoIcon}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color={colors.appleBlue}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input]}
                value={key}
                onChangeText={setKey}
                placeholder="Enter new key"
                secureTextEntry
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.cancelButton, {borderWidth: 1, borderColor: colors.appleBlue}]}
                  onPress={onClose}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.appleBlue }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: colors.appleBlue }]}
                  onPress={handleSave}
                >
                  <Text style={[styles.saveButtonText, { color: "white" }]}>Save</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.disclaimer]}>
                Note: While we utilize the OpenAI API, we are not endorsed,
                sponsored by, or affiliated with OpenAI. We're an independent
                application striving to provide value through AI technology.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const DrawerItem = () => (
    <TouchableOpacity
      style={[styles.drawerItem, { backgroundColor: colors.mainComponentBackground }]}
      onPress={() => setIsModalVisible(true)}
    >
      <Text style={[styles.drawerItemText, { color: colors.appleBlue }]}>Manage API Key</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <DrawerItem />
      <PromptEditModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    margin: 20,
    padding: 15,
    marginTop: 50,
    borderRadius: 10,
    height: 48,
  },
  drawerItemText: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: layout.components.inputModals.width,
  },
  greyPartContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  infoIcon: {
    position: "absolute",
    right: 15,
  },
  input: {
    width: "100%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  disclaimer: {
    marginTop: 40,
    marginHorizontal: 40,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
  },
  saveButtonText: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  description: {
    flex: 1,
    position: "absolute",
    top: -22,
    left: 15,
    opacity: 0.6,
  },
  descriptionText: {
    fontSize: 12,
  },
});

export default APIKeyManagement;
