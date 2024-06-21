import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import fonts from "../config/fonts";
import colors from "../config/colors";
import layout from "../config/layout";

import CheckMark from "./CheckMark";

const DefinitionPopup = ({
  added,
  visible,
  onClose,
  word,
  definition,
  isLoading,
  location,
  onToggleCheck,
  started,
  finished,
}) => {
  const [addText, setAddText] = useState("");

  useEffect(() => {
    if (visible) {
      setAddText(""); // Reset addText when the modal becomes visible
    }
  }, [visible]);

  useEffect(() => {
    if (finished && visible) {
      const text = "Added to deck";
      const words = text.split(" ");
      let index = 0;

      const interval = setInterval(() => {
        setAddText((prev) => (prev ? `${prev} ${words[index]}` : words[index]));
        index += 1;
        if (index === words.length) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [finished, visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <Text style={styles.wordText}>{word}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={28} color={colors.utilityBlue} />
                </TouchableOpacity>
              </View>
              <View style={styles.content}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="grey" />
                  </View>
                ) : (
                  <Text style={styles.definitionText}>{definition}</Text>
                )}
              </View>
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={onToggleCheck}
                  activeOpacity={1}
                  style={{ flexDirection: "row" }}
                >
                  <CheckMark checked={added} started={started} finished={finished} checkDelay={400} />
                  <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>{addText}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .03)", // Semi-transparent background
  },
  modalView: {
    backgroundColor: "white",
    width: 450,
    borderRadius: 10,
    borderColor: colors.utilityBlueUltraLight,
    // add some subtle shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderColor: colors.utilityBlueUltraLight,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  wordText: {
    fontSize: 24,
    fontFamily: fonts.main,
    color: colors.defHeader,
    fontWeight: "500",
  },
  definitionText: {
    padding: 20,
    fontFamily: fonts.main,
    fontWeight: "400",
    color: colors.defText,
    fontSize: 22,
  },
  content: {
    padding: 10,
  },
  footer: {
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 70,
  },
  footerTextContainer: {
    marginLeft: 10,
  },
  footerText: {
    fontFamily: fonts.main,
    color: colors.utilityBlue,
    fontSize: 24,
    marginLeft: 10,
    opacity: 0.5,
  },
});

export default DefinitionPopup;
