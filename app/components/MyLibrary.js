import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import BookCoverThumb from "./BookCoverThumb";
import layout from "../config/layout";
import WidgetHeader from "./WidgetHeader";
import { useThemeColors } from "../config/colors";

export default function MyLibrary({ books, onBookPress, onPressLibrary }) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPressLibrary}
      activeOpacity={0.8}
      style={[
        styles.pressableContainer,
        { backgroundColor: colors.mainComponentBackground },
      ]}
    >
      <View style={styles.container}>
        <WidgetHeader text="Library" />
        <ScrollView 
          horizontal 
          style={styles.booksContainer} 
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.hiddenStrip}></View>
          {books.map((book) => (
            <TouchableOpacity
              key={book.id || book.name} // Prefer using a unique ID if available
              activeOpacity={0.8}
              onPress={() => onBookPress(book)} // Pass the entire book object
              accessibilityLabel={`Book titled ${book.title}`}
              accessibilityHint="Tap to open the book for reading"
              style={[
                styles.bookItem,
                // Remove or comment out the borderColor and borderWidth
                // { borderColor: book.color || "green" }, 
                // borderWidth: 2, // Remove this line
              ]}
            >
              <BookCoverThumb
                title={book.title || "Untitled"}
                subtitle={book.subtitle || "No Subtitle"}
                color={book.color || "green"}
                status={book.status || 0}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    padding: 10, // Adjust as needed
    borderRadius: layout.borderRadius.homeScreenWidgetsSandwich,
    shadowColor: layout.shadows.homeScreenWidgets.shadowColor,
    shadowOffset: layout.shadows.homeScreenWidgets.shadowOffset,
    shadowOpacity: layout.shadows.homeScreenWidgets.shadowOpacity,
    shadowRadius: layout.shadows.homeScreenWidgets.shadowRadius,
    elevation: layout.shadows.homeScreenWidgets.elevation,
  },
  container: {
    flex: 1,
  },
  hiddenStrip: {
  },
  booksContainer: {
    marginTop: 10, // Adjust as needed
    paddingLeft: layout.components.hiddenStrip.width, 
  },
  bookItem: {
    borderRadius: 8, 
    overflow: "hidden", 
  },
});