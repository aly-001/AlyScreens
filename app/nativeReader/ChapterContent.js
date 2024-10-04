import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

function ChapterContent({ chapterContent, onWordPress, onNextChapter, onPrevChapter, onShowToc }) {
  // Recursive function to render content
  const renderContent = (nodes, keyPrefix = '') => {
    return nodes.map((node, index) => {
      const key = `${keyPrefix}-${index}`;
      if (typeof node === 'string') {
        // Text node
        return (
          <Text key={key} style={{ color: 'black' }}>
            {node}
          </Text>
        );
      } else if (node.type) {
        // Element node
        const Element = getNativeElement(node.type);
        const children = node.children ? renderContent(node.children, key) : null;
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
        {renderContent(chapterContent)}
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