// colors.js
import { useColorScheme } from 'react-native';
import { useSettingsContext } from "../context/useSettingsContext";

const lightColors = {
  wordBorder: "lightgrey",
  bottomWidgetIcon: "lightgrey",
  divider: "black",
  appearanceSwitch: "light",
  mainComponentBackground: "white",
  rose: "#D8C1F2",
  utilityBlue: "#1B225C",
  utilityBlueLight: "#8489B3",
  utilityBlueUltraLight: "#B8BACE",
  utilityBlueCrazyLight: "#EEEFF5",
  utilityGrey: "#2E2E2E",
  utilityGreyLight: "#A6A6A6",
  utilityGreyUltraLight: "#CDCDCD",
  utilityGrayCrazyLight: "#F1F1F5",
  appleBlue: "#007AFF",
  appleBlueShade: "#007AFF",
  newWords: "#447a83",
  learnWords: "#D15A6C",
  dueWords: "#708eb9",
  word: "#898989",
  tabs: {
    again: "#2E2E2E",
    hard: "#2E2E2E",
    good: "#2E2E2E",
    easy: "#2E2E2E",
  },

  inactiveGrey: "rgba(128, 128, 128, 1)",
  homeScreenBackground: "#F1F1F5",
  homeScreenIcon: "#e7e6ea",
  screenHeader: "#A6A6A6",
  widgetHeader: "#808080",
  defHeader: "#3F3F3F",
  defText: "#4C4C4C",
  translationPopup: {
    background: "rgba(200, 200, 200, 1)",
    grammarModuleShade: "#ddf1e1",
    translationModuleShade: "#ffffff",
    moduleAModuleShade: "#f8eee9",
    moduleBModuleShade: "#e7dfed",
    contextModuleShade: "#ffffff",
  },
  readScreen:{
    primary: "white",
  },
  book: {
    pinkRed: "#D15A6C",
    greyBlue: "#708eb9",
    khakhi: "#83947c",
    stormySea: "#447a83",
    skyBlue: "#2ac0ec",
    lightPurple: "#697cea",
    burntOrange: "#c47b57",
    bronzeKki: "#92926d",
    greyAqua: "#53aaac",
    tanned: "#C9A795",
    elephantGrey: "#9cb9d1",
    sickFrog: "#9dc5b2",
    chewedGum: "#C59DB0",
    grass: "#94b87b",
    darkLilac: "#A07BB8",
    greyBrown: "#ae898a",
    cement: "#89AEAD",
    sand: "#d2c6b9",
  },
};

const darkColors = {
  wordBorder: "lightpink",
  bottomWidgetIcon: "lightgrey",
  divider: "white",
  appearanceSwitch: "dark",
  mainComponentBackground: "brown",
  rose: "#A694B5",
  utilityBlue: "#2D3875",
  utilityBlueLight: "#6A70A0",
  utilityBlueUltraLight: "#9A9DBF",
  utilityBlueCrazyLight: "#2A2E45",
  utilityGrey: "white",
  utilityGreyLight: "#595959",
  utilityGreyUltraLight: "#323232",
  utilityGrayCrazyLight: "#0E0E0A",
  appleBlue: "#007AFF",
  appleBlueShade: "#007AFF",
  newWords: "#5A9DA8",
  learnWords: "#FF7A8D",
  dueWords: "#8EAEE0",
  word: "#767676",
  tabs: {
    again: "#D1D1D1",
    hard: "#D1D1D1",
    good: "#D1D1D1",
    easy: "#D1D1D1",
  },
  inactiveGrey: "rgba(200, 200, 200, 0.5)",
  homeScreenBackground: "#0E0E0A",
  homeScreenIcon: "#181915",
  screenHeader: "#595959",
  widgetHeader: "white",
  defHeader: "#C0C0C0",
  defText: "#B3B3B3",
  translationPopup: {
    background: "rgba(55, 55, 55, 1)",
    grammarModuleShade: "#1E2E20",
    translationModuleShade: "#1A1A1A",
    moduleAModuleShade: "#2E2420",
    moduleBModuleShade: "#25202D",
    contextModuleShade: "#1A1A1A",
  },
  readScreen:{
    primary: "black",
  },
  book: {
    pinkRed: "#FF7A8D",
    greyBlue: "#8EAEE0",
    khakhi: "#A3B49C",
    stormySea: "#5A9DA8",
    skyBlue: "#4DD0FC",
    lightPurple: "#899EFA",
    burntOrange: "#E49B77",
    bronzeKki: "#B2B28D",
    greyAqua: "#73CACC",
    tanned: "#E9C7B5",
    elephantGrey: "#BCD9F1",
    sickFrog: "#BDE5D2",
    chewedGum: "#E5BDD0",
    grass: "#B4D89B",
    darkLilac: "#C09BD8",
    greyBrown: "#CEA9AA",
    cement: "#A9CECD",
    sand: "#F2E6D9",
  },
};

export const useThemeColors = () => {
  const { settings } = useSettingsContext();
  const systemColorScheme = useColorScheme();

  const isDarkMode = 
    settings.theme === 'system' 
      ? systemColorScheme === 'dark'
      : settings.theme === 'dark';

  return isDarkMode ? darkColors : lightColors;
};

export default lightColors;