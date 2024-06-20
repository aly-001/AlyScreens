import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EpubPicker = ({ onPickComplete }) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true, // This is important
      });

      if (result.assets && result.assets.length > 0) {
        const sourceUri = result.assets[0].uri;
        const fileName = sourceUri.split('/').pop();
        const destinationUri = FileSystem.documentDirectory + fileName;

        // Copy file from cache to document directory
        await FileSystem.copyAsync({
          from: sourceUri,
          to: destinationUri,
        });

        // Verify the file was copied successfully
        const fileInfo = await FileSystem.getInfoAsync(destinationUri);
        if (!fileInfo.exists) {
          throw new Error('Failed to copy file to document directory');
        }

        await AsyncStorage.setItem('currentEpubUri', destinationUri);
        
        Alert.alert('Success', 'EPUB file stored successfully');
        
        if (onPickComplete) {
          onPickComplete(destinationUri);
        }
      }
    } catch (error) {
      console.error('Error picking or storing document:', error);
      Alert.alert('Error', 'Failed to store EPUB file');
    }
  };

  return (
    <View>
      <Button title="Pick EPUB File" onPress={pickDocument} />
    </View>
  );
};

export default EpubPicker;