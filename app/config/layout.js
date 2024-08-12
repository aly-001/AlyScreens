// layout.js

const layout = {
  borderRadius: {
    homeScreenWidgets: 20,
    // Add more border radius constants as needed
  },
  margins: {
    screenHeaderMargin: 25,
    homeScreenWidgets: 30,
    practiceScreenPaddingHorizontal: 30,
    // Add more margin constants as needed
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
    // Add more shadow configurations as needed
  },
  fontSize: {
    FlashCardModuleBox: 24,
  }
  // You can add more categories here as needed, such as:
  // spacing: { ... },
  // sizes: { ... },
};

export default layout;