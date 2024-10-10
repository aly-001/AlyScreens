import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Pager from './app/components/Pager';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <Pager>
      <View style={[styles.view, { backgroundColor: '#FFCDD2' }]}>
        <Text>View 1</Text>
      </View>
      <View style={[styles.view, { backgroundColor: '#C8E6C9' }]}>
        <Text>View 2</Text>
      </View>
      <View style={[styles.view, { backgroundColor: '#BBDEFB' }]}>
        <Text>View 3</Text>
      </View>
    </Pager>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,  // Use screen height
  },
});