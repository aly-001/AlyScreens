import { Dimensions } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const { width, height } = Dimensions.get('window');

// Device size breakpoint
const DEVICE_SIZE_THRESHOLD = 768; // Common breakpoint for tablet-sized devices

// Device type check
const isSmallDevice = width < DEVICE_SIZE_THRESHOLD;

// Responsive value function
const getResponsiveValue = (smallDeviceValue, largeDeviceValue) => {
  return isSmallDevice ? smallDeviceValue : largeDeviceValue;
};

const layout = {
  borderRadius: {
    homeScreenWidgets: 20,
  },
  margins: {
    homeScreen: {
      betweenHeaderAndWidgets: getResponsiveValue(50, 90),
    },
    screenHeaderMargin: 25,
    homeScreenWidgets: 30,
    practiceScreenPaddingHorizontal: 30,
  },
  shadows: {
    homeScreenWidgets: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.09,
      shadowRadius: 15,
      elevation: 0,
    },
  },
  fontSize: {
    ScreenHeader: getResponsiveValue(30, 50),
    FlashCardModuleBox: getResponsiveValue(20, 24),
    widgetHeader: getResponsiveValue(20, 30),
  },
  components: {
    bookCoverThumb: {
      height: getResponsiveValue(120, 190), 
      width: getResponsiveValue(90, 150), 
    }
  }
};

export default layout;