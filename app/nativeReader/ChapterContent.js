import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

function ChapterContent({ chapterContent, onWordPress, onNextChapter, onPrevChapter, onShowToc }) {
  const wordsRef = useRef([]); // Reference to store all words with unique IDs
  const [wordsList, setWordsList] = useState([]); // State to hold the flat list of words with unique IDs
  const [renderedContent, setRenderedContent] = useState(null); // State to hold the rendered JSX content

  // Preprocess chapterContent to extract all words into wordsList with unique IDs
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
              console.log("wordCounter", currentWord);

              return (
                <Text
                  key={wIndex}
                  style={{ color: 'black', fontSize: 20 }}
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
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {renderedContent}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={onPrevChapter}>
          <Text style={{ padding: 16, fontSize: 16 }}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShowToc}>
          <Text style={{ padding: 16, fontSize: 16 }}>Contents</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNextChapter}>
          <Text style={{ padding: 16, fontSize: 16 }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ChapterContent;