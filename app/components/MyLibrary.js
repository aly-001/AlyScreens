import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import React from "react";

import BookCoverThumb from "./BookCoverThumb";
import layout from "../config/layout";
import WidgetHeader from "./WidgetHeader";

const books = [
  {
    title: "Le Compte de Monte-Cristo",
    subtitle: "Alexandre Dumas",
    color: "#D15A6C",
    status: 13,
  },
  {
    title: "L'Étranger",
    subtitle: "Albert Camus",
    color: "#708eb9",
    status: 50,
  },
  {
    title: "À la recherche du temps perdu",
    subtitle: "Marcel Proust",
    color: "#83947c",
    status: 70,
  },
  {
    title: "Madame Bovary",
    subtitle: "Gustave Flaubert",
    color: "#447a83",
    status: 90,
  },
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
          <TouchableOpacity key={index} activeOpacity={.8}>
          <BookCoverThumb
            key={index}
            title={book.title}
            subtitle={book.subtitle}
            color={book.color}
            status={book.status}
          />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hiddenStrip: {
    width: 45,
  },
  booksContainer: {
  },
  container: {
    paddingBottom: 35,
    flex: 1,
    marginHorizontal: layout.margins.homeScreenWidgets / 2,
    backgroundColor: "white",
    borderRadius: layout.borderRadius.homeScreenWidgets,

    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  nicolas:{
    fontSize: 20,
    fontWeight: "500",
    color: "#83947c",
    marginLeft: 20,
    marginTop: 20,
  }
});
