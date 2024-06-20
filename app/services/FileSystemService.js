// Code to save epub to document directory and check if file exists in document directory
import * as FileSystem from 'expo-file-system';

export const saveFileToDocumentDirectory = async (fileUri, fileName) => {
  const destinationUri = FileSystem.documentDirectory + fileName;
  await FileSystem.copyAsync({
    from: fileUri,
    to: destinationUri,
  });
  return destinationUri;
};

export const checkFileExists = async (fileUri) => {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  return fileInfo.exists;
};