import React from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';

function TableOfContents({ chapters, onSelectChapter }) {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chapters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onSelectChapter(index)}>
            <Text style={{ padding: 16, fontSize: 16 }}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default TableOfContents;