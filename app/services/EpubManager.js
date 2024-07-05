// Desc: Service for managing EPUB files, including saving and loading them from the device's file system.
// When an EPUB is selected, it gets moved to the app's document directory using the FileSystemService.
// Then, the URI of the stored EPUB is saved in AsyncStorage using the StorageService.

import { saveFileToDocumentDirectory, checkFileExists } from './FileSystemService';
import { saveEpubUri, getEpubUri, removeEpubUri } from './StorageService';

export const saveEpub = async (fileAsset) => {
  try {
    const destinationUri = await saveFileToDocumentDirectory(fileAsset.uri, fileAsset.name);
    await saveEpubUri(destinationUri);
    return destinationUri;
  } catch (error) {
    console.error('Error saving EPUB:', error);
    throw error;
  }
};

export const loadStoredEpub = async () => {
  try {
    const storedUri = await getEpubUri();
    if (storedUri) {
      const fileExists = await checkFileExists(storedUri);
      if (fileExists) {
        return storedUri;
      } else {
        await removeEpubUri();
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading stored EPUB:', error);
    return null;
  }
};

export const removeEpub = async () =>{
  try {
    const storedUri = await getEpubUri();
    if (storedUri) {
      await removeEpubUri();
      return storedUri;
    }
    return null;
  } catch (error) {
    console.error('Error removing stored EPUB:', error);
    return null;
  }
}