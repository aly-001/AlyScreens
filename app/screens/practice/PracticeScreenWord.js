import React from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar, TouchableWithoutFeedback } from 'react-native';

import { useThemeColors } from "../../config/colors";
import PracticeStatsFooter from "../../components/PracticeStatsFooter";
import { useFlashcards } from "../../context/FlashcardContext";
import FlashcardModuleBox from "../../components/FlashcardModuleBox";
import FlashcardModuleBoxGeneral from "../../components/FlashcardModuleBoxGeneral";
import Markdown from 'react-native-markdown-display';
import layout from "../../config/layout";


export default function PracticeScreenWord({ navigation }) {
  const colors = useThemeColors();
  const { currentCard, stats } = useFlashcards();

  const handlePress = () => {
    navigation.navigate("Def");
  };

  const renderCardContent = () => {
    if (!currentCard) return <Text>No more cards available</Text>;
    let frontData;
    try {
      frontData = JSON.parse(currentCard.front[0]);
    } catch (error) {
      console.error("Error parsing card data:", error);
      return <Text>Error: Could not parse card data</Text>;
    }
    if (!frontData || typeof frontData !== "object") {
      console.error("Invalid card data format");
      return <Text>Error: Invalid card data format</Text>;
    }
    return (
      <View style={styles.contentContainer}>
        <FlashcardModuleBoxGeneral color="white" openable={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.word, {color: colors.utilityGrey}]}>{frontData.word || "N/A"}</Text>
          </View>
        </FlashcardModuleBoxGeneral>
        {frontData.context && (
          <FlashcardModuleBox text={frontData.context} color={colors.translationPopup.contextModuleShade} quotes={true}/>
        )}
        {frontData.grammarExplanation && (
          <FlashcardModuleBoxGeneral color={colors.translationPopup.grammarModuleShade}>
            <Markdown>
              {frontData.grammarExplanation}
            </Markdown>
          </FlashcardModuleBoxGeneral>
        )}
        {frontData.moduleA && (
          <FlashcardModuleBox text={frontData.moduleA} color={colors.translationPopup.moduleAModuleShade} />
        )}
        {frontData.moduleB && (
          <FlashcardModuleBox text={frontData.moduleB} color={colors.translationPopup.moduleBModuleShade} />  
        )}

      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.homeScreenBackground}]}>
      <StatusBar hidden={true} />
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
          {renderCardContent()}
          <View style={styles.footer}>
            <PracticeStatsFooter
              newCount={stats.new}
              learnCount={stats.learning}
              dueCount={stats.due + stats.overdue}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  contentContainer:{
    justifyContent: "center",
    flex: 1,
  },
  container: {
    marginHorizontal: layout.flashCards.margins.contentPaddingHorizontal,
    flex: 1,
  },
  wordContainer: {
    justifyContent: "center",
    marginBottom: 20,
  },
  word: {
    fontSize: layout.flashCards.fontSize.word,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 60,
  },
});
