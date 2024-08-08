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
} from "react-native";
import { useAPIKey } from "../context/APIKeyContext";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";

const APIKeyManagement = () => {
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
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.greyPartContainer}>
              <Text style={styles.modalTitle}>Manage API Key</Text>
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
              style={styles.input}
              value={key}
              onChangeText={setKey}
              multiline
              placeholder={`Enter new key`}
              secureTextEntry
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              
            </View>
            <Text style={styles.disclaimer}>
              Note: While we utilize the OpenAI API, we are not endorsed,
              sponsored by, or affiliated with OpenAI. We're an independent
              application striving to provide value through AI technology.
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  const DrawerItem = () => (
    <>
      
      <TouchableOpacity
      
        style={styles.drawerItem}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.drawerItemText}>Manage API Key</Text>
      </TouchableOpacity>
    </>
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
    backgroundColor: "white",
    padding: 15,
    marginTop: 40,
    borderRadius: 10,
    height: 48,
  },
  drawerItemText: {
    fontSize: 16,
    color: colors.appleBlue,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "80%",
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
    backgroundColor: "#F2F2F7",
    fontSize: 16,
  },
  disclaimer: {
    marginTop: 40,
    marginHorizontal: 40,
    fontSize: 12,
    color: colors.utilityGrey,
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
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.appleBlue,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.appleBlue,
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
  },
  saveButtonText: {
    color: "white",
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
    color: colors.utilityGrey,
  },
});

export default APIKeyManagement;
