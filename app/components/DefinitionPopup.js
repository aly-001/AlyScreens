import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import fonts from "../config/fonts";
import colors from "../config/colors";
import CheckMark from "./CheckMark";

const { width, height } = Dimensions.get("window");

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
  const [direction, setDirection] = useState("D");

  useEffect(() => {
    if (visible) {
      setAddText("");
    }
  }, [visible]);

  useEffect(() => {
    if (location) {
      const { top, left } = calculatePosition(location);
      const newDirection = calculateDirection(top, left);
      updateDirection(newDirection);
    }
  }, [location]);

  useEffect(() => {
    if (finished && visible) {
      animateAddText();
    }
  }, [finished, visible]);

  const calculatePosition = (loc) => ({
    top: loc.top + loc.height * 2 + 5,
    left: loc.left + loc.width / 2 + 15,
  });

  const calculateDirection = (top, left) => {
    if (left < width - (width * 3.75) / 6.25 && top < height * (3.5 / 9)) return "R";
    if (left < (width * 3.75) / 6.25 && top > height * (3.5 / 9)) return "U";
    if (left > width - (width * 3.75) / 6.25 && left < (width * 3.75) / 6.25 && top < height * (3.5 / 9)) return "D";
    if (left > (width * 3.75) / 6.5) return "L";
    return "D";
  };

  const updateDirection = (newDirection) => {
    setDirection((prevDirection) => {
      if (prevDirection !== newDirection) {
        console.log("New Direction:", newDirection);
        console.log("Position:", { top: location.top, left: location.left });
        console.log("Screen:", { width, height });
      }
      return newDirection;
    });
  };

  const animateAddText = () => {
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
  };

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
              <ModalHeader word={word} onClose={onClose} />
              <ModalContent isLoading={isLoading} definition={definition} />
              <ModalFooter
                added={added}
                started={started}
                finished={finished}
                onToggleCheck={onToggleCheck}
                addText={addText}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ModalHeader = ({ word, onClose }) => (
  <View style={styles.header}>
    <Text style={styles.wordText}>{word}</Text>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Ionicons name="close" size={28} color={colors.utilityBlue} />
    </TouchableOpacity>
  </View>
);

const ModalContent = ({ isLoading, definition }) => (
  <View style={styles.content}>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    ) : (
      <Text style={styles.definitionText}>{definition}</Text>
    )}
  </View>
);

const ModalFooter = ({ added, started, finished, onToggleCheck, addText }) => (
  <View style={styles.footer}>
    <TouchableOpacity
      onPress={onToggleCheck}
      activeOpacity={1}
      style={{ flexDirection: "row" }}
    >
      <CheckMark
        added={added}
        started={started}
        finished={finished}
        checkDelay={400}
      />
      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>{addText}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .03)",
  },
  modalView: {
    backgroundColor: "white",
    width: (width * 3.75) / 6.25,
    borderRadius: 10,
    borderColor: colors.utilityBlueUltraLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
  content: {
    padding: 10,
  },
  definitionText: {
    padding: 20,
    fontFamily: fonts.main,
    fontWeight: "400",
    color: colors.defText,
    fontSize: 22,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DefinitionPopup;