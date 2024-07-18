import * as FileSystem from 'expo-file-system';

const audioDirectory = `${FileSystem.documentDirectory}audio/`;
const imageDirectory = `${FileSystem.documentDirectory}images/`;

const listDirectoryContents = async (directory) => {
  try {
    const contents = await FileSystem.readDirectoryAsync(directory);
    console.log(`Contents of ${directory}:`, contents);
    
    // Optionally, get more details about each file
    for (const item of contents) {
      const fileInfo = await FileSystem.getInfoAsync(`${directory}/${item}`);
      console.log(`${item}:`, fileInfo);
    }
  } catch (error) {
    console.error("Error listing directory contents:", error);
  }
};

const clearAudioDiectory = async () => {
  try {
    await FileSystem.deleteAsync(audioDirectory, { idempotent: true });
    console.log(`Cleared audio directory at: ${audioDirectory}`);
  } catch (error) {
    console.error("Error clearing audio directory:", error);
  }
};

const clearImageDiectory = async () => {
  try {
    await FileSystem.deleteAsync(imageDirectory, { idempotent: true });
    console.log(`Cleared image directory at: ${imageDirectory}`);
  } catch (error) {
    console.error("Error clearing image directory:", error);
  }
};

const listAudioDirectory = async () => {
  await listDirectoryContents(audioDirectory);
}

// export both functions for use in the app
export { listAudioDirectory, clearAudioDiectory, clearImageDiectory };