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

const layout = {
  borderRadius: {
    homeScreenWidgets: getResponsiveValue(50, 20),
    homeScreenWidgetsSandwich: getResponsiveValue(0, 20),
    dictionaryScreenWidgets: getResponsiveValue(15, 20),
  },
  margins: {
    homeScreen: {
      betweenHeaderAndWidgets: getResponsiveValue(50, 140),
      widgetHeader: getResponsiveValue(20, 30),
    },
    dictionaryScreen:{
      widgetsVertical: getResponsiveValue(35, 35),
      widgetsHorizontal: getResponsiveValue(0, 35),
      betweenHeaderAndWidgets: getResponsiveValue(120, 140),
      maxScrollViewHeight: getResponsiveValue(200, 265),
    },
    libraryScreen:{
      footerMargin: getResponsiveValue(50, 100),
      maxScrollViewHeight: getResponsiveValue(460, 800),
    },
    screenHeaderMargin: 25,
    homeScreenWidgets: getResponsiveValue(0, 35),
    practiceScreenPaddingHorizontal: 30,
  },
  shadows: {
    homeScreenWidgets: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: getResponsiveValue(0, 0),
      shadowRadius: 15,
      elevation: 0,
    },
  },
  fontSize: {
    ScreenHeader: getResponsiveValue(35, 50),
    FlashCardModuleBox: getResponsiveValue(20, 24),
    widgetHeader: getResponsiveValue(20, 30),
    word: getResponsiveValue(18, 20),
    dictionary: {
      sectionTitle: getResponsiveValue(17, 20),
    }
  },
  components: {
    bookCoverThumb: {
      height: getResponsiveValue(120, 190), 
      width: getResponsiveValue(90, 150),
      spacingWidth: getResponsiveValue(112, 190),
      titleFontSize: getResponsiveValue(14, 18), 
    },
    hiddenStrip: {
      width: getResponsiveValue(30, 45),
    },
    flashcardBackModal :{
      closeButtonOffset: getResponsiveValue(-25, -35),
    },
  },
  icons: {
    homeScreenBottomWidget: getResponsiveValue(45, 65)
  },
  flashCards: {
    fontSize: {
      word: getResponsiveValue(30, 50),
      flashcardModuleBox: getResponsiveValue(18, 24),
    },
  },
};

export default layout;