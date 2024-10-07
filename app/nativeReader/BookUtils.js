import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

/**
 * Reads the color information from a book's Info folder.
 * @param {string} bookDir - The directory path of the book.
 * @returns {Promise<string>} - The hex color string.
 */
export const readBookColor = async (bookDir) => {
  try {
    const colorPath = `${bookDir}Info/color.json`;
    const colorExists = await FileSystem.getInfoAsync(colorPath);
    if (colorExists.exists) {
      const colorContent = await FileSystem.readAsStringAsync(colorPath);
      const colorData = JSON.parse(colorContent);
      return colorData.color || "#000000";
    } else {
      // Handle the case where color.json does not exist
      return "#000000"; // Default color
    }
  } catch (error) {
    console.error("Error reading book color:", error);
    return "#000000"; // Default color on error
  }
};

/**
 * Reads the title of the book from the Info folder.
 * @param {string} bookDir - The directory path of the book.
 * @returns {Promise<string>} - The title of the book.
 */
export const readBookTitle = async (bookDir) => {
  try {
    const titlePath = `${bookDir}Info/title.json`;
    const titleExists = await FileSystem.getInfoAsync(titlePath);
    if (titleExists.exists) {
      const titleContent = await FileSystem.readAsStringAsync(titlePath);
      const titleData = JSON.parse(titleContent);
      return titleData.title || "Untitled Book";
    } else {
      // Handle the case where title.json does not exist
      return "Untitled Book";
    }
  } catch (error) {
    console.error("Error reading book title:", error);
    return "Untitled Book"; // Default title on error
  }
};

/**
 * Assigns a unique color to a book and saves it in the Info folder.
 * @param {string} bookDir - The directory path of the book.
 * @param {string} color - The hex color string to assign.
 */
export const assignBookColor = async (bookDir, color) => {
  try {
    const infoDir = `${bookDir}Info/`;
    await FileSystem.makeDirectoryAsync(infoDir, { intermediates: true });

    const colorData = { color: color };
    const colorPath = `${infoDir}color.json`;
    await FileSystem.writeAsStringAsync(colorPath, JSON.stringify(colorData, null, 2));
  } catch (error) {
    console.error("Error assigning book color:", error);
    Alert.alert("Error", "Failed to assign color to the book.");
  }
};

/**
 * Assigns a title to a book and saves it in the Info folder.
 * @param {string} bookDir - The directory path of the book.
 * @param {string} title - The title to assign.
 */
export const assignBookTitle = async (bookDir, title) => {
  try {
    const infoDir = `${bookDir}Info/`;
    await FileSystem.makeDirectoryAsync(infoDir, { intermediates: true });

    const titleData = { title: title };
    const titlePath = `${infoDir}title.json`;
    await FileSystem.writeAsStringAsync(titlePath, JSON.stringify(titleData, null, 2));
  } catch (error) {
    console.error("Error assigning book title:", error);
    Alert.alert("Error", "Failed to assign title to the book.");
  }
};


export function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}