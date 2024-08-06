import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import colors from "../config/colors";
import PracticeStatsFooter from "../components/PracticeStatsFooter";
import PracticeRatingTab from "../components/PracticeRatingTab";
import PracticeDividerLine from "../components/PracticeDividerLine";
import PracticeAudio from "../components/PracticeAudio";
import { useFlashcards } from "../context/FlashcardContext";

const { width, height } = Dimensions.get("window");

export default function PracticeScreenDef() {
  const [imageUri, setImageUri] = useState(null);
  const [displayedCard, setDisplayedCard] = useState(null);
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
    const unsubscribe = navigation.addListener('transitionEnd', () => {
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
        // console.log("Setting up audio...");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: false
        });
        // console.log("Audio setup complete");
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
          const imageFileName = backData.imageID + '.png';
          const imagePath = `${FileSystem.documentDirectory}images/${imageFileName}`;
          
          const fileInfo = await FileSystem.getInfoAsync(imagePath);
          if (fileInfo.exists) {
            setImageUri(imagePath);
          } else {
            setImageUri(null);
          }
          // console.log("Image effect hook reloaded");
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
        const audioID = backData[audioType === 'word' ? 'audioWordID' : 'audioContextID'];
  
        // If audioID is null, exit the function peacefully
        if (audioID === null) {
          console.log(`No audio available for ${audioType}`);
          return;
        }
  
        const audioFileName = `${audioID}.mp3`;
        const audioPath = `${FileSystem.documentDirectory}audio/${audioFileName}`;
        // console.log("Audio path:", audioPath);
  
        const fileInfo = await FileSystem.getInfoAsync(audioPath);
        if (!fileInfo.exists) {
          console.log(`Audio file does not exist for ${audioType}: ${audioPath}`);
          return;
        }
  
        // console.log("Audio file size:", fileInfo.size, "bytes");
        // console.log("Creating sound object...");
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioPath },
          { shouldPlay: false }
        );
        // console.log("Sound object created");
        console.log("Playing audio...");
        const playbackStatus = await sound.playAsync();
        // console.log("Playback status:", playbackStatus);
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            // console.log("Audio finished playing");
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
      <>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{backData.word || "N/A"}</Text>
        </View>
        <View style={styles.defContainer}>
          <Text style={styles.def}>{backData.wordDef || "N/A"}</Text>
        </View>
        <View style={styles.dividerLine}>
          <PracticeDividerLine
            width="100%"
            height={2}
            color={colors.utilityGreyUltraLight}
          />
        </View>
        <View style={styles.contextContainer}>
          <Text style={styles.context}>{backData.context || "N/A"}</Text>
        </View>
        <View style={styles.defContainer}>
          <Text style={styles.contextDef}>{backData.contextDef || "N/A"}</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.superContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.container}>
          {renderCardContent()}
          <View style={styles.audio}>
            <TouchableOpacity onPress={() => handleAudioPress('word')} activeOpacity={.8}>
              <PracticeAudio />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAudioPress('context')} activeOpacity={.8}>
              <PracticeAudio />
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <PracticeStatsFooter
              newCount={stats.new}
              learnCount={stats.learning}
              dueCount={stats.due}
            />
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  superContainer: {
    flex: 1,
  },
  greyArea: {
    position: "absolute",
    left: (width - 900) / 2,
    width: 900,
    height: 450,
    backgroundColor: colors.utilityGreyUltraLight,
    opacity: 0.5,
  },
  image: {
    position: "absolute",
    left: (width - 900) / 2,
    width: 900,
    height: 450,
  },
  container: {
    marginHorizontal: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  defContainer: {
    width: width * 0.8,
  },
  def: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
  },
  contextDef: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
  },
  word: {
    marginTop: 200,
    fontSize: 50,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  context: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.utilityGrey,
  },
  contextContainer: {
    width: width * 0.8,
  },
  audio: {
    position: "absolute",
    bottom: 160,
  },
  footer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
  allTabsContainer: {
    position: "absolute",
    bottom: height * 0.25 - 210,
    right: -40,
  },
  tabContainer: {
    marginBottom: 0,
  },
  dividerLine: {
    marginVertical: 50,
    width: "100%",
    width: width * 0.8,
  },
});
