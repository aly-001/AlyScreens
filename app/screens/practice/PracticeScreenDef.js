import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { TouchableOpacity as GestureHandlerTouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { useThemeColors } from "../../config/colors";
import PracticeRatingTab from "../../components/practice/PracticeRatingTab";
import PracticeAudio from "../../components/practice/PracticeAudio";
import { useFlashcards } from "../../context/FlashcardContext";
import FlashcardModuleBox from "../../components/practice/FlashcardModuleBox";
import FlashcardModuleBoxGeneral from "../../components/practice/FlashcardModuleBoxGeneral";
import layout from "../../config/layout";
import Markdown from "react-native-markdown-display";

const { width, height } = Dimensions.get("window");

export default function PracticeScreenDef() {
  const colors = useThemeColors();
  const [imageUri, setImageUri] = useState(null);
  const [displayedCard, setDisplayedCard] = useState(null);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { currentCard, submitReview, getNextCard, stats } = useFlashcards();
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (isFocused && !isNavigatingRef.current) {
      setDisplayedCard(currentCard);
    }
  }, [currentCard, isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      if (isNavigatingRef.current) {
        setDisplayedCard(currentCard);
        isNavigatingRef.current = false;
      }
    });

    return unsubscribe;
  }, [navigation, currentCard]);

  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    }

    setupAudio();
  }, []);

  useEffect(() => {
    async function loadImage() {
      if (displayedCard && displayedCard.back) {
        try {
          const backData = JSON.parse(displayedCard.back[0]);
          const imageFileName = backData.imageID + ".png";
          const imagePath = `${FileSystem.documentDirectory}images/${imageFileName}`;

          const fileInfo = await FileSystem.getInfoAsync(imagePath);
          if (fileInfo.exists) {
            setImageUri(imagePath);
          } else {
            setImageUri(null);
          }
        } catch (error) {
          console.error("Error loading image:", error);
          setImageUri(null);
        }
      }
    }

    loadImage();
  }, [displayedCard]);

  const handleReview = (rating) => {
    submitReview(rating);
    const nextCard = getNextCard();
    if (nextCard) {
      isNavigatingRef.current = true;
      navigation.navigate("Word", { fromDef: true });
    } else {
      navigation.navigate("PracticeStart");
    }
  };

  const handleAudioPress = async (audioType) => {
    
    if (displayedCard && displayedCard.back) {
      try {
        const backData = JSON.parse(displayedCard.back[0]);
        const audioID =
          backData[audioType === "word" ? "audioWordID" : "audioContextID"];

        if (audioID === null) {
          console.log(`No audio available for ${audioType}`);
          return;
        }

        const audioFileName = `${audioID}.mp3`;
        const audioPath = `${FileSystem.documentDirectory}audio/${audioFileName}`;

        const fileInfo = await FileSystem.getInfoAsync(audioPath);
        if (!fileInfo.exists) {
          console.log(
            `Audio file does not exist for ${audioType}: ${audioPath}`
          );
          return;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioPath },
          { shouldPlay: false }
        );
        console.log("Playing audio...");
        const playbackStatus = await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            await sound.unloadAsync();
          }
        });
      } catch (error) {
        console.log(`Error in audio playback for ${audioType}:`, error.message);
      }
    }
  };

  const renderCardContent = () => {
    if (!displayedCard) return <Text>No card available</Text>;
    let backData;
    try {
      backData = JSON.parse(displayedCard.back[0]);
    } catch (error) {
      console.error("Error parsing card data:", error);
      return <Text>Error: Could not parse card data</Text>;
    }
    if (!backData || typeof backData !== "object") {
      console.error("Invalid card data format");
      return <Text>Error: Invalid card data format</Text>;
    }
    return (
      <View style={styles.modulesContainer}>
        <FlashcardModuleBoxGeneral color={colors.mainComponentBackground} openable={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.word, {color: colors.utilityGrey} ]}>{backData.word || "N/A"}</Text>
            {backData.audioWordID && (
              <TouchableOpacity
                style={{ alignSelf: "flex-start" }}
                onPress={() => handleAudioPress("word")}
                activeOpacity={0.8}
              >
                <PracticeAudio />
              </TouchableOpacity>
            )}
          </View>
          {backData.wordDef && (
            <Text
              style={{
                fontSize: layout.flashCards.fontSize.flashcardModuleBox,
                fontStyle: "italic",
                color: colors.utilityGrey,
              }}
            >
              {backData.wordDef}
            </Text>
          )}
        </FlashcardModuleBoxGeneral>

        {(backData.context || backData.audioContextID) && (
          <FlashcardModuleBoxGeneral
            openable={false}
            color={colors.translationPopup.contextModuleShade}
          >
            <View>
              {backData.context && (
                <Text
                  style={{
                    fontSize: layout.flashCards.fontSize.flashcardModuleBox,
                    marginBottom: 10,
                    color: colors.utilityGrey,
                  }}
                >
                  "{backData.context}"
                </Text>
              )}
              {backData.audioContextID && (
                <TouchableOpacity
                  onPress={() => handleAudioPress("context")}
                  activeOpacity={0.8}
                  style={{ alignSelf: "flex-start" }}
                >
                  <PracticeAudio />
                </TouchableOpacity>
              )}
              {backData.contextDef && (
                <Text
                  style={{
                    fontSize: layout.flashCards.fontSize.flashcardModuleBox,
                    fontStyle: "italic",
                    color: colors.utilityGrey,
                  }}
                >
                  {backData.contextDef}
                </Text>
              )}
            </View>
          </FlashcardModuleBoxGeneral>
        )}

        {backData.grammarExplanation && (
          <FlashcardModuleBoxGeneral
            color={colors.translationPopup.grammarModuleShade}
          >
            <Markdown
              style={{
                body: { color: colors.utilityGrey },
                heading1: { color: colors.utilityGrey },
                heading2: { color: colors.utilityGrey },
                heading3: { color: colors.utilityGrey },
                heading4: { color: colors.utilityGrey },
                heading5: { color: colors.utilityGrey },
                heading6: { color: colors.utilityGrey },
                paragraph: { color: colors.utilityGrey },
                link: { color: colors.appleBlue },
                list: { color: colors.utilityGrey },
                listItem: { color: colors.utilityGrey },
                strong: { color: colors.utilityGrey },
                em: { color: colors.utilityGrey },
              }}
            >{backData.grammarExplanation}</Markdown>
          </FlashcardModuleBoxGeneral>
        )}
        {backData.moduleA && (
          <FlashcardModuleBox
            text={backData.moduleA}
            color={colors.translationPopup.moduleAModuleShade}
          />
        )}
        {backData.moduleB && (
          <FlashcardModuleBox
            text={backData.moduleB}
            color={colors.translationPopup.moduleBModuleShade}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.homeScreenBackground}]}>
      <StatusBar hidden={true} />
      <View style={styles.superContainer}>
        {imageUri ? (
          <ImageBackground
            source={{ uri: imageUri }}
            style={styles.backgroundImage}
            blurRadius={5}
          >
            <BlurView intensity={30} style={StyleSheet.absoluteFill}>
              <View style={styles.lightTintOverlay} />
              <TouchableOpacity
                onPress={() => setFullscreenVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </BlurView>
          </ImageBackground>
        ) : null}
        <View style={styles.container}>
          {imageUri ? (
            <ScrollView
            showsVerticalScrollIndicator={false} 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
            >
              {renderCardContent()}
            </ScrollView>
          ) : (
            renderCardContent()
          )}

          <View style={styles.allTabsContainer}>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Again"
                onPress={() => handleReview("again")}
              />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Hard"
                onPress={() => handleReview("hard")}
              />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Good"
                onPress={() => handleReview("good")}
              />
            </View>
            <View style={styles.tabContainer}>
              <PracticeRatingTab
                rating="Easy"
                onPress={() => handleReview("easy")}
              />
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={fullscreenVisible}
        transparent={true}
        animationType="fade"
      >
        <ImageBackground
          source={{ uri: imageUri }}
          style={styles.modalBackgroundImage}
          blurRadius={10}
        >
          <BlurView intensity={100} style={StyleSheet.absoluteFill}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setFullscreenVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: imageUri }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            </View>
          </BlurView>
        </ImageBackground>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  superContainer: {
    flex: 1,
  },
  container: {
    top: layout.flashCards.margins.allContentExceptImageTop,
    marginRight: 40,
    marginLeft: layout.flashCards.margins.contentPaddingHorizontal,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  modulesContainer: {
    marginVertical: layout.flashCards.margins.betweenModulesAndImage,
    width: "90%",
  },
  word: {
    fontSize: layout.flashCards.fontSize.word,
    fontWeight: "600",
    marginBottom: 10,
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 60,
  },
  allTabsContainer: {
    position: "absolute",
    bottom: layout.margins.practiceScreenBack.allTabsContainerBottom,
    right: layout.margins.practiceScreenBack.allTabsContainerRight,
  },
  tabContainer: {
    marginBottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: layout.flashCards.image.width,
    top: layout.flashCards.image.top,
  },
  lightTintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: layout.flashCards.image.width,
    height: layout.flashCards.image.width,
  },
  modalBackgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});