import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import layout from '../config/layout';
import { useThemeColors } from '../config/colors';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function FlashcardModuleBox({ color, text = '', maxHeight = 200, borderRadius = 20, quotes = false }) {
  const colors = useThemeColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.measure((x, y, width, height) => {
        setTextHeight(height);
        setIsOverflowing(height > maxHeight);
      });
    }
  }, [text, maxHeight]);

  const formattedText = quotes ? `"${text}"` : text;

  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <View style={[
          styles.container,
          {
            backgroundColor: color,
            borderRadius: borderRadius,
            maxHeight: maxHeight,
          }
        ]}>
          <Text style={{fontSize: layout.flashCards.fontSize.flashcardModuleBox}} numberOfLines={null} ref={textRef}>
            {formattedText}
          </Text>
          {isOverflowing && (
            <View style={styles.fadeOverlay}>
              <Text style={styles.readMoreText}>Read More</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { backgroundColor: color, borderRadius: borderRadius }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={colors.utilityGrey} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.text}>{formattedText}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
  },
  container: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    overflow: 'hidden',
    minHeight: 50, // Add a minimum height to prevent collapse
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    width: screenWidth * 0.8,
    maxHeight: screenHeight * 0.6,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  scrollViewContent: {
    paddingTop: 40,
  },
});
