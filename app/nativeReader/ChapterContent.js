import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, PixelRatio, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for icons
import { useThemeColors } from "../config/colors";

function ChapterContent({ 
  chapterContent, 
  onWordPress, 
  onNextChapter, 
  onPrevChapter, 
  onShowToc, 
  startLocation, 
  onLocationChange 
}) {
  const colors = useThemeColors();
  const wordsRef = useRef([]); // Reference to store all words with unique IDs
  const scrollViewRef = useRef(null); // ScrollView ref
  const [wordsList, setWordsList] = useState([]); // State to hold the flat list of words with unique IDs
  const [renderedContent, setRenderedContent] = useState(null); // State to hold the rendered JSX content

  // **Ref to Track Initial Scroll**
  const hasScrolledInitial = useRef(false); // Ensures initial scroll happens only once

  // **State to Manage Controls Visibility**
  const [controlsVisible, setControlsVisible] = useState(false);

  // **Ref to Track Previous Scroll Position**
  const previousScrollY = useRef(0);

  // **Scroll Threshold for Detecting Significant Scroll**
  const FooterScrollThreshold = 20; // Adjust as needed

  // **Handle Scroll Events to Toggle Controls Visibility**
  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDifference = currentScrollY - previousScrollY.current;

    if (Math.abs(scrollDifference) < FooterScrollThreshold) {
      // Ignore small scrolls
      return;
    }

    if (scrollDifference > 0) {
      // Scrolling Down
      if (controlsVisible) {
        setControlsVisible(false);
      }
    } else {
      // Scrolling Up
      if (!controlsVisible) {
        setControlsVisible(true);
      }
    }

    previousScrollY.current = currentScrollY;
  };

  // Preprocess `chapterContent` to extract all words into `wordsList` with unique IDs
  useEffect(() => {
    const extractWords = (nodes) => {
      let words = [];
      let wordId = 0; // Unique identifier for each word

      const traverse = (nodes) => {
        nodes.forEach((node) => {
          if (typeof node === 'string') {
            const splitWords = node.split(/\s+/).filter(w => w);
            splitWords.forEach(word => {
              words.push({ id: wordId++, text: word });
            });
          } else if (node.children) {
            traverse(node.children);
          }
        });
      };
      traverse(nodes);
      return words;
    };

    const extractedWords = extractWords(chapterContent);
    wordsRef.current = extractedWords;
    setWordsList(extractedWords);
  }, [chapterContent]);

  // Effect to render and save content in memory when component mounts or props change
  useEffect(() => {
    const content = renderContent(chapterContent);
    setRenderedContent(content);
  }, [chapterContent, wordsList]);

  // **Scroll Handling: Perform Initial Scroll Once Content Size is Ready**
  const handleContentSizeChange = (width, height) => {
    console.log("Content size changed:", { width, height });
    if (!hasScrolledInitial.current && scrollViewRef.current && startLocation !== undefined) {
      // Use requestAnimationFrame to ensure layout is complete
      requestAnimationFrame(() => {
        if (scrollViewRef.current) {
          console.log("Attempting to scroll to startLocation:", startLocation);
          scrollViewRef.current.scrollTo({ y: startLocation, animated: false });
          hasScrolledInitial.current = true; // Ensure scroll happens only once
          console.log("Scroll to startLocation executed.");
        }
      });
    }
  };

  // **Calculate Scroll Threshold Based on Physical Inches**
  const inches = 2; // Number of inches for throttling
  const dpi = PixelRatio.get(); // Get device pixel density
  const scrollThreshold = inches * dpi; // Convert inches to pixels

  const lastScrollY = useRef(0); // Ref to store the last scroll position

  // Recursive function to render content
  const renderContent = (nodes, keyPrefix = '', wordCounter = { current: 0 }) => {
    return nodes.map((node, index) => {
      const key = `${keyPrefix}-${index}`;
      if (typeof node === 'string') {
        // Split the string into words and spaces
        const words = node.split(/(\s+)/);
        return (
          <Text key={key} style={{ color: 'black', flexWrap: 'wrap' }}>
            {words.map((word, wIndex) => {
              if (word.trim() === '') {
                // Render spaces as plain text
                return word;
              }

              const currentWord = wordsRef.current[wordCounter.current];
              wordCounter.current += 1;

              return (
                <Text
                  key={wIndex}
                  style={{ color: 'black', fontSize: 20, fontFamily: 'LibreBaskerville', lineHeight: 40 }}
                  onPress={(event) => handleWordPress(currentWord.text, currentWord.id, event)}
                >
                  {word}
                </Text>
              );
            })}
          </Text>
        );
      } else if (node.type) {
        // Element node
        const Element = getNativeElement(node.type);
        const children = node.children ? renderContent(node.children, key, wordCounter) : null;
        const props = getProps(node);
        return (
          <Element key={key} {...props}>
            {children}
          </Element>
        );
      }
      return null;
    });
  };

  // Handle word press to pass the required objects to onWordPress
  const handleWordPress = (word, id, event) => {
    // Define the range for inner context (5 words before and after)
    const innerStart = Math.max(0, id - 5);
    const innerEnd = Math.min(wordsList.length, id + 6); // +6 because slice is non-inclusive at the end
    const innerContext = wordsList.slice(innerStart, innerEnd).map(w => w.text).join(' ');

    // Define the range for outer context (50 words before and after)
    const outerStart = Math.max(0, id - 50);
    const outerEnd = Math.min(wordsList.length, id + 51);
    const outerContext = wordsList.slice(outerStart, outerEnd).map(w => w.text).join(' ');

    // Extract location information from the event
    const { pageX, pageY } = event.nativeEvent;
    const location = { left: pageX, top: pageY };

    // Pass the word, its contexts, and location to the onWordPress handler
    onWordPress({
      word,
      innerContext,
      outerContext,
      location
    });
  };

  // Map HTML tags to native components
  const getNativeElement = (tagName) => {
    switch (tagName) {
      case 'p':
        return Text;
      case 'div':
      case 'section':
      case 'body':
        return View;
      case 'span':
        return Text;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return Text;
      case 'ul':
        return View;
      case 'ol':
        return View;
      case 'li':
        return Text;
      // Add more mappings as needed
      default:
        return Text;
    }
  };

  // Extract props and styles
  const getProps = (node) => {
    const props = {};
    if (node.props) {
      if (node.props.style) {
        props.style = parseInlineStyle(node.props.style);
      }
      // Add other props if needed
    }
    return props;
  };

  // Parse inline styles
  const parseInlineStyle = (styleString) => {
    // Simple parser converting CSS style string to a React Native style object
    const style = {};
    const styleEntries = styleString.split(';').filter((s) => s.trim() !== '');
    styleEntries.forEach((entry) => {
      const [property, value] = entry.split(':').map((s) => s.trim());
      if (property && value) {
        // Convert CSS property to camelCase
        const reactProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        style[reactProp] = value;
      }
    });
    return style;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1, padding: 16, paddingTop: 100}}
        onScroll={(event) => {
          handleScroll(event);
          const yOffset = event.nativeEvent.contentOffset.y;
          if (Math.abs(yOffset - lastScrollY.current) > scrollThreshold) {
            onLocationChange(yOffset);
            lastScrollY.current = yOffset; // Update the last scroll position
            console.log("onLocationChange triggered with yOffset:", yOffset);
          }
        }}
        scrollEventThrottle={16} // Increased throttle for smoother detection
        onContentSizeChange={handleContentSizeChange}
      >
        {renderedContent}
        <View style={{ height: 400 }} />
      </ScrollView>

      {/* **Navigation Controls** */}
      {controlsVisible && (
        <View style={styles.navigationControls}>
          <TouchableOpacity onPress={onPrevChapter} style={styles.controlButton}>
            <Ionicons name="chevron-back" size={24} color={colors.highlightColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShowToc} style={styles.controlButton}>
            <Ionicons name="list" size={24} color={colors.highlightColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNextChapter} style={styles.controlButton}>
            <Ionicons name="chevron-forward" size={24} color={colors.highlightColor} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// **Styles for Navigation Controls**
const styles = StyleSheet.create({
  navigationControls: {
    position: 'absolute',
    bottom: 100, // Adjust as needed
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // Remove background color if using opaque buttons
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
    width: 80,
    height: 50,
    borderRadius: 25, // Makes the button circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    // Remove text styles as icons are used
    // fontSize: 16,
    // color: 'blue',
  },
});

export default ChapterContent;