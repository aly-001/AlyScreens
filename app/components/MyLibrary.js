import { View, StyleSheet, ScrollView, Text } from "react-native";
import React from "react";

import BookCoverThumb from "./BookCoverThumb";
import fonts from "../config/fonts";
import colors from "../config/colors";
import borderRadius from "../config/borderRadius";
import WidgetHeader from "./WidgetHeader";
import shadows from "../config/shadows";
import margins from "../config/margins";

const books = [
  {
    title: "War and Peace",
    subtitle: "Leo Tolstoy",
    color: "#D15A6C",
    status: 30,
  },
  {
    title: "The Great Gatsby",
    subtitle: "F. Scott Fitzgerald",
    color: "#708eb9",
    status: 50,
  },
  {
    title: "The Catcher in the Rye",
    subtitle: "J.D. Salinger",
    color: "#83947c",
    status: 70,
  },
  {
    title: "To Kill a Mockingbird",
    subtitle: "Harper Lee",
    color: "#447a83",
    status: 90,
  },
  {
    title: "1984",
    subtitle: "George Orwell",
    color: "#2ac0ec",
    status: 100,
  },
  {
    title: "Animal Farm",
    subtitle: "George Orwell",
    color: "#697cea",
    status: 20,
  },
  {
    title: "Brave New World",
    subtitle: "Aldous Huxley",
    color: "#c47b57",
    status: 40,
  },
  {
    title: "Lord of the Flies",
    subtitle: "William Golding",
    color: "#92926d",
    status: 60,
  },
];

export default function MyLibrary({}) {
  return (
    <View style={styles.container}>
      <WidgetHeader text="Library" />
      <ScrollView horizontal style={styles.booksContainer}>
        <View style={styles.hiddenStrip}></View>
        {books.map((book, index) => (
          <BookCoverThumb
            key={index}
            title={book.title}
            subtitle={book.subtitle}
            color={book.color}
            status={book.status}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hiddenStrip: {
    width: 35,
  },
  booksContainer: {
  },
  container: {
    paddingBottom: 35,
    flex: 1,
    marginHorizontal: margins.homeScreenWidgets / 2,
    backgroundColor: "white",
    borderRadius: borderRadius.homeScreenWidgets,

    shadowColor: shadows.homeScreenWidgets.shadowColor,
    shadowOffset: shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: shadows.homeScreenWidgets.shadowRadius,
    elevation: shadows.homeScreenWidgets.elevation,
  },
});
