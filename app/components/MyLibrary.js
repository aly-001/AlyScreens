import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import BookCoverThumb from "./BookCoverThumb";
import layout from "../config/layout";
import WidgetHeader from "./WidgetHeader";

export default function MyLibrary({ books, onBookPress }) {
  return (
    <View style={styles.container}>
      <WidgetHeader text="Library" />
      <ScrollView horizontal style={styles.booksContainer}>
        <View style={styles.hiddenStrip}></View>
        {books.map((book, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={.8} 
            onPress={() => onBookPress(book.name)}
          >
            <BookCoverThumb
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
