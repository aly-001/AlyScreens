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


/**
 * Converts a hex color string to its HSL representation.
 * 
 * @param {string} hex - The hex color string.
 * @returns {Object|null} - An object with h, s, l properties or null if invalid.
 */
export const hexToHSL = (hex) => {
  // Remove '#' if present
  hex = hex.replace(/^#/, '');

  if (hex.length !== 6) {
    return null;
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l;
  
  l = (max + min) / 2;

  if(max === min){
      h = s = 0; // achromatic
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
          default: h = 0;
      }
      h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
};

/**
 * Generates a unique, soft, and un-saturated color using the HSL color model.
 * Ensures the generated color is not already in use.
 * 
 * @param {Array} excludedColors - An array of hex color strings to exclude.
 * @param {Set} usedHues - A set of hues already used to ensure color distinction.
 * @returns {string} - A hex color string.
 */
export const generateUniqueSoftColor = (excludedColors, usedHues) => {
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  let color;
  let attempts = 0;
  const MAX_ATTEMPTS = 1000;

  while (attempts < MAX_ATTEMPTS) {
    const hue = Math.floor(Math.random() * 360);
    
    // Ensure a diverse set of hues by checking usedHues
    if (usedHues.has(hue)) {
      attempts++;
      continue;
    }

    const saturation = 30; // Low saturation for un-saturated colors
    const lightness = 70;   // High lightness for soft colors

    color = hslToHex(hue, saturation, lightness);

    if (!excludedColors.includes(color)) {
      usedHues.add(hue); // Track used hue
      break;
    }

    attempts++;
  }

  if (attempts === MAX_ATTEMPTS) {
    throw new Error('Unable to generate a unique soft color.');
  }

  return color;
};