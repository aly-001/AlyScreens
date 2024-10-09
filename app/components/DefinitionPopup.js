import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import fonts from "../config/fonts";
import { useThemeColors } from "../config/colors"; // Import the hook to access theme colors
import Pointer from "./Pointer";
import { useSettingsContext } from "../context/useSettingsContext";
import FlashcardModuleBoxGeneral from "../components/FlashcardModuleBoxGeneral";
import Markdown from "react-native-markdown-display";

import LoadingText from "./LoadingText";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import layout from "../config/layout";

const { width, height } = Dimensions.get("window");

const DefinitionPopup = ({
  visible,
  onClose,
  word,
  definition,
  isLoading,
  location,
  finished,
  currentGrammar,
  grammarLoading,
  audioBase64,
  audioLoading,
  moduleALoading,
  currentModuleA,
  moduleBLoading,
  currentModuleB,
}) => {
  console.log("location", location);
  const [addText, setAddText] = useState("");
  const [direction, setDirection] = useState("D");
  const [locationTop, setLocationTop] = useState(0);
  const [locationLeft, setLocationLeft] = useState(0);
  const [maxHeight, setMaxHeight] = useState(450);

  const settings = useSettingsContext().settings;
  const colors = useThemeColors(); // Access theme colors

  const widthRatio = layout.translationPopup.widthRatio;

  useEffect(() => {
    console.log("DefinitionPopup: visible changed to", visible);
    if (visible) {
      setAddText("");
    }
  }, [visible]);

  useEffect(() => {
    console.log("DefinitionPopup: location changed to", location);
    if (location) {
      const { top, left } = calculatePosition(location);
      if (isNaN(top) || isNaN(left)) {
        console.error(
          "calculatePosition returned NaN values. Ensure location has valid 'top', 'left', 'height', and 'width'."
        );
        return;
      }
      console.log("DefinitionPopup: Calculated position - top:", top, "left:", left);
      const newDirection = calculateDirection(top, left);
      console.log("DefinitionPopup: New direction:", newDirection);
      updateDirection(newDirection);
      setLocationTop(top);
      setLocationLeft(left);

      // Determine the maxHeight based on the location
      const screenThird = height / 3;
      if (top > screenThird && top < 2 * screenThird) {
        setMaxHeight(layout.translationPopup.maxHeightMiddle);
        console.log("DefinitionPopup: maxHeight set to maxHeightMiddle:", layout.translationPopup.maxHeightMiddle);
      } else {
        setMaxHeight(layout.translationPopup.maxHeightTop);
        console.log("DefinitionPopup: maxHeight set to maxHeightTop:", layout.translationPopup.maxHeightTop);
      }
    }
  }, [location]);

  useEffect(() => {
    console.log("DefinitionPopup: finished or visible changed - finished:", finished, "visible:", visible);
    if (finished && visible) {
      animateAddText();
    }
  }, [finished, visible]);

  const calculatePosition = (loc) => {
    const locHeight = loc.height;
    const locWidth = loc.width;

    if (typeof locHeight !== "number" || typeof locWidth !== "number") {
      // Provide default values or handle the error as needed
      return {
        top: loc.top || 0,
        left: loc.left || 0,
      };
    }

    return {
      top: loc.top + locHeight * 2 + 5,
      left: loc.left + locWidth / 2 + 15,
    };
  };

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
        console.log("Position:", { top: locationTop, left: locationLeft });
        console.log("Screen:", { width, height });
      }
      return newDirection;
    });
  };

  const animateAddText = () => {
    const text = "Generate flashcard";
    const words = text.split(" ");
    let index = 0;

    console.log("[animateAddText] Starting text animation.");

    const interval = setInterval(() => {
      setAddText((prev) => {
        const newText = prev ? `${prev} ${words[index]}` : words[index];
        console.log(`[animateAddText] Adding word "${words[index]}" -> "${newText}"`);
        return newText;
      });
      index += 1;
      if (index === words.length) {
        console.log("[animateAddText] Animation complete.");
        clearInterval(interval);
      }
    }, 50);

    return () => {
      console.log("[animateAddText] Cleaning up interval.");
      clearInterval(interval);
    };
  };

  const calculateModalLeft = () => {
    if (widthRatio == null) {
      console.error("[calculateModalLeft] widthRatio is null or undefined!");
      return 0; // Fallback value
    }

    if (locationLeft == null) {
      console.error("[calculateModalLeft] locationLeft is null or undefined!");
      return 0; // Fallback value
    }

    const modalWidth = width * widthRatio;
    console.log("[calculateModalLeft] modalWidth:", modalWidth);

    let x = locationLeft - modalWidth / 2;
    console.log("[calculateModalLeft] Initial x:", x);

    const padding = 20;

    if (x < 0) {
      x = 0 + padding;
      console.log("[calculateModalLeft] x adjusted for left padding:", x);
    } else if (x + modalWidth > width) {
      x = width - modalWidth - padding;
      console.log("[calculateModalLeft] x adjusted for right padding:", x);
    } else {
      console.log("[calculateModalLeft] x within bounds:", x);
    }

    if (isNaN(x)) {
      console.error("[calculateModalLeft] Computed x is NaN!");
    } else {
      console.log("[calculateModalLeft] Final x:", x);
    }

    return x;
  };

  const calculatePointerLeft = () => {
    if (widthRatio == null) {
      console.error("[calculatePointerLeft] widthRatio is null or undefined!");
      return 0; // Fallback value
    }

    if (locationLeft == null) {
      console.error("[calculatePointerLeft] locationLeft is null or undefined!");
      return 0; // Fallback value
    }

    const modalWidth = width * widthRatio;
    console.log("[calculatePointerLeft] modalWidth:", modalWidth);

    let x = locationLeft - modalWidth / 2;
    console.log("[calculatePointerLeft] Initial x:", x);

    let z = modalWidth / 2;
    console.log("[calculatePointerLeft] Initial z:", z);

    const padding = 20;

    if (x < 0) {
      // pushed right
      z = locationLeft - padding;
      console.log("[calculatePointerLeft] z adjusted for left padding:", z);
    } else if (x + modalWidth > width) {
      z = modalWidth + locationLeft - width + padding;
      console.log("[calculatePointerLeft] z adjusted for right padding:", z);
    } else {
      console.log("[calculatePointerLeft] z within bounds:", z);
    }

    if (isNaN(z)) {
      console.error("[calculatePointerLeft] Computed z is NaN!");
    } else {
      console.log("[calculatePointerLeft] Final z:", z);
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
                    styles.modalViewContainer,
                    (() => {
                      const computedLeft = calculateModalLeft();
                      console.log("[DefinitionPopup] Applying left:", computedLeft);

                      if (isNaN(computedLeft)) {
                        console.error("[DefinitionPopup] left is NaN! Setting to 0 as fallback.");
                        return {
                          backgroundColor: colors.translationPopup.background,
                          width: width * widthRatio,
                          position: "absolute",
                          left: 0, // Fallback value
                          maxHeight: maxHeight,
                        };
                      }

                      return {
                        backgroundColor: colors.translationPopup.background,
                        width: width * widthRatio,
                        position: "absolute",
                        left: computedLeft,
                        maxHeight: maxHeight,
                      };
                    })(),
                  ]}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.modalView}
                    contentContainerStyle={styles.modalViewContent}
                  >
                    <ModalHeader word={word} onClose={onClose} />
                    <Divider />
                    {settings.translationPopupAudio && (
                      <>
                        <ModalAudio
                          audioBase64={audioBase64}
                          audioLoading={audioLoading}
                        />
                        <Divider />
                      </>
                    )}
                    <ModalDef isLoading={isLoading} definition={definition} />
                    <Divider />
                    {settings.translationPopupGrammar && (
                      <>
                        <ModalGram
                          grammarLoading={grammarLoading}
                          currentGrammar={currentGrammar}
                        />
                        <Divider />
                      </>
                    )}
                    {settings.translationPopupModuleA && (
                      <>
                        <ModalModuleA
                          moduleALoading={moduleALoading}
                          currentModuleA={currentModuleA}
                        />
                        <Divider />
                      </>
                    )}
                    {settings.translationPopupModuleB && (
                      <>
                        <ModalModuleB
                          moduleBLoading={moduleBLoading}
                          currentModuleB={currentModuleB}
                        />
                        <Divider />
                      </>
                    )}
                  </ScrollView>

                  <View
                    style={[
                      styles.pointerContainer,
                      direction === "U"
                        ? styles.pointerBottom
                        : styles.pointerTop,
                      (() => {
                        const pointerLeft = calculatePointerLeft() - 6;
                        console.log("[DefinitionPopup] Applying pointer left:", pointerLeft);

                        if (isNaN(pointerLeft)) {
                          console.error("[DefinitionPopup] pointerLeft is NaN! Setting to 0 as fallback.");
                          return { left: 0 };
                        }

                        return { left: pointerLeft };
                      })(),
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

const Divider = () => {
  const colors = useThemeColors(); // Access theme colors

  return (
    <TouchableWithoutFeedback>
      <View
        style={{
          backgroundColor: colors.translationPopup.background,
          height: 15,
        }}
      />
    </TouchableWithoutFeedback>
  );
};

const ModalHeader = ({ word, onClose }) => {
  const colors = useThemeColors(); // Access theme colors

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: colors.translationPopup.translationModuleShade,
          marginTop: 15,
        },
      ]}
    >
      <Text style={styles.wordText}>{word}</Text>
    </View>
  );
};

const ModalDef = ({ isLoading, definition }) => {
  const colors = useThemeColors(); // Access theme colors

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: colors.translationPopup.translationModuleShade,
        },
      ]}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingText
            text="Loading translation..."
            barColor={colors.translationPopup.translationModuleShade}
          />
        </View>
      ) : (
        <FlashcardModuleBoxGeneral
          margin={false}
          color={colors.translationPopup.translationModuleShade}
        >
          <Text style={styles.definitionText}>{definition}</Text>
        </FlashcardModuleBoxGeneral>
      )}
    </View>
  );
};

const ModalAudio = ({ audioBase64, audioLoading }) => {
  const colors = useThemeColors(); // Access theme colors
  const [isPlaying, setIsPlaying] = useState(false);
  const { playSound, stopSound } = useAudioPlayer(audioBase64);

  const handlePlayPress = async () => {
    if (isPlaying) {
      await stopSound();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await playSound();
      setIsPlaying(false);
    }
  };

  return (
    <View
      style={[
        styles.content,
        { backgroundColor: colors.translationPopup.translationModuleShade },
      ]}
    >
      {audioLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingText
            text="Loading audio..."
            barColor={colors.translationPopup.translationModuleShade}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={handlePlayPress} disabled={!audioBase64}>
          <Ionicons
            name="play"
            size={28}
            color={audioBase64 ? colors.utilityGrey : colors.disabledGrey}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const ModalGram = ({ grammarLoading, currentGrammar }) => {
  const colors = useThemeColors(); // Access theme colors

  return (
    <View
      style={[
        styles.content,
        { backgroundColor: colors.translationPopup.grammarModuleShade },
      ]}
    >
      {grammarLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingText
            text="Loading grammar..."
            barColor={colors.translationPopup.grammarModuleShade}
          />
        </View>
      ) : (
        <FlashcardModuleBoxGeneral
          margin={false}
          color={colors.translationPopup.grammarModuleShade}
        >
          <Markdown style={styles.definitionText}>{currentGrammar}</Markdown>
        </FlashcardModuleBoxGeneral>
      )}
    </View>
  );
};

const ModalModuleA = ({ moduleALoading, currentModuleA }) => {
  const colors = useThemeColors(); // Access theme colors

  return (
    <View
      style={[
        styles.content,
        { backgroundColor: colors.translationPopup.moduleAModuleShade },
      ]}
    >
      {moduleALoading ? (
        <View style={styles.loadingContainer}>
          <LoadingText
            text="Loading custom module A..."
            barColor={colors.translationPopup.moduleAModuleShade}
          />
        </View>
      ) : (
        <FlashcardModuleBoxGeneral
          margin={false}
          color={colors.translationPopup.moduleAModuleShade}
        >
          <Text style={styles.definitionText}>{currentModuleA}</Text>
        </FlashcardModuleBoxGeneral>
      )}
    </View>
  );
};

const ModalModuleB = ({ moduleBLoading, currentModuleB }) => {
  const colors = useThemeColors(); // Access theme colors

  return (
    <View
      style={[
        styles.content,
        { backgroundColor: colors.translationPopup.moduleBModuleShade },
      ]}
    >
      {moduleBLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingText
            text="Loading custom module B..."
            barColor={colors.translationPopup.moduleBModuleShade}
          />
        </View>
      ) : (
        <FlashcardModuleBoxGeneral
          margin={false}
          color={colors.translationPopup.moduleBModuleShade}
        >
          <Text style={styles.definitionText}>{currentModuleB}</Text>
        </FlashcardModuleBoxGeneral>
      )}
    </View>
  );
};

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
  modalViewContainer: {
    borderRadius: 10,
    paddingVertical: 15,
  },
  modalView: {
    flex: 1,
  },
  modalViewContent: {
    flexGrow: 1,
    paddingBottom: 15,
  },
  header: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  wordText: {
    fontSize: layout.translationPopup.fontSize.word,
    fontFamily: fonts.main,
    fontWeight: "500",
  },
  content: {
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  definitionText: {
    fontFamily: fonts.main,
    fontWeight: "400",
    fontSize: layout.translationPopup.fontSize.definition,
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
    color: "white",
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
  highlight: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white", // Replace with colors.translationPopup.background if needed
    zIndex: 1,
  },
});

export default DefinitionPopup;