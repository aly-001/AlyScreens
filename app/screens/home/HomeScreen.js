import React, { useCallback, useRef } from "react";
import { View, StyleSheet, ScrollView, Animated } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import layout from "../../config/layout";
import MyLibrary from "../../components/MyLibrary";
import BottomWidget from "../../components/BottomWidget";
import { TouchableWithoutFeedback, TouchableOpacity } from "react-native-gesture-handler";
import { useBooks } from "../../context/BooksContext";
import StatBoxMax from "../../components/StatBoxMax";
import { FlashcardProvider } from "../../context/FlashcardContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { books, loadBooks } = useBooks();
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.screenHeaderContainer, { opacity: headerOpacity }]}>
        <ScreenHeader text="Home" />
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.topWidgetContainer}>
          <TouchableOpacity
          activeOpacity={0.7}
            onPress={() => navigation.navigate("Dictionary")}
          >
            <FlashcardProvider>
              <StatBoxMax />
            </FlashcardProvider>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
        activeOpacity={0.7}
          onPress={() => navigation.navigate("Library")}
        >
          <View style={styles.libraryContainer}>
            <MyLibrary books={books} onBookPress={handleBookPress} />
          </View>
        </TouchableOpacity>
        <View style={styles.bottomWidgetContainer}>
          <BottomWidget
            style={{
              borderBottomEndRadius:
                layout.borderRadius.homeScreenWidgetsSandwich,
            }}
            header="Help"
            IconComponent={(props) => (
              <FontAwesome5
                name="question"
                size={layout.icons.homeScreenBottomWidget}
                color={colors.homeScreenIcon}
                style={styles.icon}
                {...props}
              />
            )}
          />
          <BottomWidget
            style={{
              borderBottomStartRadius:
                layout.borderRadius.homeScreenWidgetsSandwich,
            }}
            header="Settings"
            IconComponent={(props) => (
              <FontAwesome6
                name="gear"
                size={layout.icons.homeScreenBottomWidget}
                color={colors.homeScreenIcon}
                style={styles.icon}
                {...props}
              />
            )}
            onPress={() => navigation.navigate("Config")}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  screenHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.margins.homeScreenWidgets / 2,
    paddingTop: layout.margins.homeScreen.betweenHeaderAndWidgets + 60, // Add extra padding to account for the header
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
  icon: {
    bottom: 20,
    paddingBottom: 30,
  },
});