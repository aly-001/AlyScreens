// Desc: Service to store and retrieve an epub URI (hardcoded as 'currentEpubUri' for now) from AsyncStorage
// When epubs get stored in the sandboxed file system, their URIs are stored in AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveEpubUri = async (uri) => {
  await AsyncStorage.setItem('currentEpubUri', uri);
};

export const getEpubUri = async () => {
  return await AsyncStorage.getItem('currentEpubUri');
};

export const removeEpubUri = async () => {
  await AsyncStorage.removeItem('currentEpubUri');
};