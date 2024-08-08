import React, { useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../components/ScreenHeader";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import Screen from "../components/Screen";
import StatBox from "../components/StatBox";
import colors from "../config/colors";
import layout from "../config/layout";
import MyLibrary from "../components/MyLibrary";
import BottomWidget from "../components/BottomWidget";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useBooks } from "../context/BooksContext";

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
    <View style={styles.superContainer}>
      <Screen>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Home" />
          </View>
          <View style={styles.topWidgetContainer}>
            <StatBox header="All" value={books.length} valueColor="green" />
            <StatBox
              header="Learning"
              value={books.filter((book) => book.status < 100).length}
              valueColor="blue"
            />
            <StatBox
              header="Mature"
              value={books.filter((book) => book.status === 100).length}
              valueColor="red"
            />
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
                  style={{ position: "absolute", top: -30 }}
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
                  style={{ position: "absolute", top: -30 }}
                  {...props}
                />
              )}
              onPress={() => navigation.navigate("Config")}
            />
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  contentContainer: {
    flex: 1,
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: 210,
  },
  headerContainer: {
    position: "absolute",
    top: 30,
    left: layout.margins.homeScreenWidgets,
    zIndex: 1,
  },
  topWidgetContainer: {
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
    marginBottom: 80,
  },
});
