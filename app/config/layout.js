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
    homeScreenWidgets: getResponsiveValue(50, 20),
    homeScreenWidgetsSandwich: getResponsiveValue(0, 20),
    dictionaryScreenWidgets: getResponsiveValue(15, 20),
    startButton: getResponsiveValue(0, 15),
  },
  margins: {
    homeScreen: {
      betweenHeaderAndWidgets: getResponsiveValue(80, 140),
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
    practiceScreenStart: {
      startButton: getResponsiveValue(44, 100),
      startButtonHorizontal: getResponsiveValue(0, 35),
    },
    practiceScreenBack :{
      allTabsContainerBottom: getResponsiveValue(60, 100),
      allTabsContainerRight: getResponsiveValue(-42, -41),
    },
    screenHeaderMargin: 25,
    screenHeaderMarginTop: getResponsiveValue(35, 0),
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
    inputModals: {
      width: getResponsiveValue("100%", "80%"),
      justifyContent: getResponsiveValue("flex-start", "center"),
      backgroundColor: getResponsiveValue('rgba(0, 0, 0, .2)', 'rgba(0, 0, 0, 0.2)'),
    },
    practiceRatingTab: {
      marginBottom: getResponsiveValue(20, 50),
      textContainerPaddingVertical: getResponsiveValue(20, 30),
      textFontSize: getResponsiveValue(18, 20),
      width: getResponsiveValue(70, 100),
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
    margins: {
      betweenModulesAndImage: getResponsiveValue(0, 45),
      allContentExceptImageTop: getResponsiveValue(-40, 0), // only on iOS iPhone
      contentPaddingHorizontal: getResponsiveValue(0, 40),
    },
    image: {
      width: getResponsiveValue(300, 400),
      top: getResponsiveValue(-60, 0), // only on iOS iPhone
    }
  },
};

export default layout;