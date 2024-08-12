import React, { useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import layout from "../../config/layout";
import MyLibrary from "../../components/MyLibrary";
import BottomWidget from "../../components/BottomWidget";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useBooks } from "../../context/BooksContext";
import StatBoxMax from "../../components/StatBoxMax";
import { FlashcardProvider } from "../../context/FlashcardContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { books, loadBooks } = useBooks();

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  const handleBookPress = (bookName) => {
    const book = books.find((b) => b.name === bookName);
    if (book) {
      navigation.navigate("Read", {
        screen: "ReadScreen",
        params: {
          uri: book.uri,
          title: book.title,
          color: book.color,
          status: 40,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader text="Home" style={styles.header} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topWidgetContainer}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Dictionary")}
          >
            <FlashcardProvider>
              <StatBoxMax />
            </FlashcardProvider>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Library")}
        >
          <View style={styles.libraryContainer}>
            <MyLibrary books={books} onBookPress={handleBookPress} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.bottomWidgetContainer}>
          <BottomWidget
            header="Help"
            IconComponent={(props) => (
              <FontAwesome5
                name="question"
                size={65}
                color={colors.homeScreenIcon}
                style={styles.icon}
                {...props}
              />
            )}
          />
          <BottomWidget
            header="Settings"
            IconComponent={(props) => (
              <FontAwesome6
                name="gear"
                size={65}
                color={colors.homeScreenIcon}
                style={styles.icon}
                {...props}
              />
            )}
            onPress={() => navigation.navigate("Config")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  header: {
    position: "absolute",
    width: 100,
    height: 60,

  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: layout.margins.homeScreen.betweenHeaderAndWidgets,
  },
  topWidgetContainer: {
    marginHorizontal: layout.margins.homeScreenWidgets / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.margins.homeScreenWidgets,
  },
  libraryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.margins.homeScreenWidgets,
  },
  bottomWidgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
  },
  icon:{
    bottom: 45,
    paddingBottom: 30,
  }
});