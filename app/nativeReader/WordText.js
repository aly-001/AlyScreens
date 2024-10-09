import React from 'react';
import { Text } from 'react-native';

const WordText = ({ word, id, onWordPress, children }) => {
  const handlePress = (event) => {
    onWordPress(word, id, event);
  };

  return (
    <Text
      style={{ color: 'blue' }}
      onPress={handlePress}
    >
      {children}
    </Text>
  );
};

export default React.memo(WordText);