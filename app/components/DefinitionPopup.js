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
import Pointer from "./Pointer";
import PulsatingCircles from "./PulsatingCircles";

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
  const [locationTop, setLocationTop] = useState(0);
  const [locationLeft, setLocationLeft] = useState(0);

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
      setLocationTop(top);
      setLocationLeft(left);
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
    if (top < 450) {
      return "D";
    } else {
      return "U";
    }
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
    const text = "Generate flashcard";
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

  const calculateModalLeft = () => {
    const modalWidth = width * (3.75 / 6.25);
    let x = locationLeft - modalWidth / 2;
    padding = 20;

    if (x < 0) {
      x = 0 + padding;
    } else if (x + modalWidth > width) {
      x = width - modalWidth - padding;
    }

    return x;
  };

  const calculatePointerLeft = () => {
    const modalWidth = width * (3.75 / 6.25);
    let x = locationLeft - modalWidth / 2;
    let z = modalWidth / 2;
    padding = 20;

    if (x < 0) {
      // pushed right
      z = locationLeft - padding;
    } else if (x + modalWidth > width) {
      z = modalWidth + locationLeft - width + padding;
    }

    return z;
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
          <View
            style={[
              styles.stabilizer1,
              direction === "D"
                ? { justifyContent: "flex-end" }
                : direction === "U"
                ? { justifyContent: "flex-start" }
                : null,
            ]}
          >
            <View
              style={[
                styles.stabilizer2,
                direction === "D"
                  ? {
                      height: height - locationTop - 30,
                      justifyContent: "flex-start",
                    }
                  : direction === "U"
                  ? { height: locationTop - 20, justifyContent: "flex-end" }
                  : null,
              ]}
            >
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalView,
                    { position: "absolute", left: calculateModalLeft() },
                  ]}
                >
                  <ModalHeader word={word} onClose={onClose} />
                  <ModalContent isLoading={isLoading} definition={definition} />
                  <ModalFooter
                    added={added}
                    started={started}
                    finished={finished}
                    onToggleCheck={onToggleCheck}
                    addText={addText}
                  />
                  <View
                    style={[
                      styles.pointerContainer,
                      direction === "U"
                        ? styles.pointerBottom
                        : styles.pointerTop,
                      { left: calculatePointerLeft() - 6 },
                    ]}
                  >
                    <Pointer direction={direction} />
                  </View>
                  <View
                    style={[
                      styles.pointerContainer,
                      direction === "U"
                        ? styles.pointerCoverBottom
                        : styles.pointerCoverTop,
                      { left: calculatePointerLeft() - 6 },
                    ]}
                  >
                    <View style={styles.pointerCover}></View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ModalHeader = ({ word, onClose }) => (
  <View style={styles.header}>
    <Text style={styles.wordText}>{word}</Text>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Ionicons name="close" size={28} color={colors.utilityGrey} />
    </TouchableOpacity>
  </View>
);

const ModalContent = ({ isLoading, definition }) => (
  <View style={styles.content}>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <PulsatingCircles />
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
        checkDelay={300}
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
    backgroundColor: "rgba(0, 0, 0, .03)",
  },
  stabilizer1: {
    flex: 1,
    justifyContent: "flex-start",
  },
  stabilizer2: {
    height: 600,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    width: (width * 3.75) / 6.25,
    borderRadius: 10,
    borderColor: colors.utilityGreyUltraLight,
    borderWidth: 1.75,
  },
  header: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderColor: colors.utilityGreyUltraLight,
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
    color: colors.utilityGrey,
    fontSize: 24,
    marginLeft: 10,
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  pointerContainer: {
    position: "absolute",
    alignItems: "center",
  },
  pointerTop: {
    top: -8,
  },
  pointerBottom: {
    bottom: -8,
  },
  pointerCover: {
    width: 80,
    height: 20,
  },
  pointerCoverTop: {
    top: 0,
    left: -5,
    right: 230,
  },
  pointerCoverBottom: {
    position: "absolute",
    bottom: 0,
    right: width * (3.75 / 6.25) - 30,
  },
  highlight: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    zIndex: 1,
  },
});

export default DefinitionPopup;
