import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device size breakpoint
const DEVICE_SIZE_THRESHOLD = 768; // Common breakpoint for tablet-sized devices

// Device type check
const isSmallDevice = width < DEVICE_SIZE_THRESHOLD;

// Responsive value function
const getResponsiveValue = (smallDeviceValue, largeDeviceValue) => {
  return isSmallDevice ? smallDeviceValue : largeDeviceValue;
};

const text = {
  homeScreen: {
    dictionaryStatsTags : {
      allWords: getResponsiveValue("All", "All Words"),
      youngWords: getResponsiveValue("Young", "Young Words"),
      matureWords: getResponsiveValue("Mature", "Mature Words"),
    }
  }
}

export default text;