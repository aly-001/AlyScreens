import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import BookCoverThumb from '../components/BookCoverThumb'; // Adjust the import path as needed
import colors from '../config/colors'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage'; // You may need to install this package

const MyLibraryScreen = () => {
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const bookMetadata = await AsyncStorage.getItem('bookMetadata');
      if (bookMetadata) {
        setBooks(JSON.parse(bookMetadata));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const handleUpload = async () => {
    try {
      console.log("Uploading file");
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });
      
      if (result.assets && result.assets.length > 0) {
        console.log("Successfully picked file");
        const sourceUri = result.assets[0].uri;
        const originalName = result.assets[0].name;
        const bookDir = FileSystem.documentDirectory + 'books/';
        const destinationUri = bookDir + originalName;

        await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });

        await FileSystem.copyAsync({
          from: sourceUri,
          to: destinationUri,
        });

        const fileInfo = await FileSystem.getInfoAsync(destinationUri);
        if (!fileInfo.exists) {
          throw new Error('Failed to copy file to document directory');
        }

        const newBook = {
          uri: destinationUri,
          name: originalName,
          title: originalName.replace('.epub', ''),
          subtitle: 'Unknown Author',
          color: getRandomColor(),
          status: 0
        };

        const updatedBooks = [...books, newBook];
        setBooks(updatedBooks);
        await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
        Alert.alert('Success', 'EPUB file stored successfully');
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to store EPUB file');
    }
  };

  const openBook = (uri) => {
    navigation.navigate('ReadScreen', { uri });
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity onPress={() => openBook(item.uri)} style={styles.bookItem}>
      <BookCoverThumb
        title={item.title}
        subtitle={item.subtitle}
        color={item.color}
        status={item.status}
      />
    </TouchableOpacity>
  );

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F38181', '#A8D8EA'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.uri}
        numColumns={2}
        contentContainerStyle={styles.bookList}
      />
      <Button title="Upload Book" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background, // Assuming you have a background color defined
  },
  bookList: {
    alignItems: 'center',
  },
  bookItem: {
    margin: 5,
  },
});

export default MyLibraryScreen;