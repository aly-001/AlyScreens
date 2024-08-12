import React from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar, TouchableWithoutFeedback } from 'react-native';

import colors from "../../config/colors";
import PracticeStatsFooter from "../../components/PracticeStatsFooter";
import PracticeDividerLine from "../../components/PracticeDividerLine";
import { useFlashcards } from "../../context/FlashcardContext";
import { ScrollView } from "react-native-gesture-handler";
import FlashcardModuleBox from "../../components/FlashcardModuleBox";
import FlashcardModuleBoxGeneral from "../../components/FlashcardModuleBoxGeneral";
import Markdown from 'react-native-markdown-display';


export default function PracticeScreenWord({ navigation }) {
  const { currentCard, stats } = useFlashcards();

  const handlePress = () => {
    navigation.navigate("Def");
  };

  const renderCardContent = () => {
;
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
    console.log("Grammar explanation:", frontData.grammarExplanation);
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
            <Text style={styles.word}>{frontData.word || "N/A"}</Text>
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
    <SafeAreaView style={styles.safeArea}>
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
    backgroundColor: colors.homeScreenBackground,
  },
  superContainer: {
    flex: 1,
  },
  contentContainer:{
    justifyContent: "center",
    flex: 1,
  },
  container: {
    marginHorizontal: 40,
    flex: 1,
  },
  wordContainer: {
    justifyContent: "center",
    marginBottom: 20,
  },
  word: {
    fontSize: 50,
    fontWeight: "600",
    color: colors.utilityGrey,
  },
  footer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 60,
  },
  dividerLine: {
    marginVertical: 50,
    width: "100%",
  },
  def: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "500",
    color: colors.utilityGrey,
    opacity: 0.85,
    padding: 5,
    borderRadius: 5,
  },
  contentBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
  },

  contentText: {
    fontSize: 30,
    fontWeight: "500",
    color: colors.utilityGrey,
  },

  contextBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.utilityGrey,
    width: '100%',
  },

  context: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.utilityGrey,
  },

});
