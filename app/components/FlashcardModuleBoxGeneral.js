import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../config/colors';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function FlashcardModuleBoxGeneral({ color, maxHeight = 200, borderRadius = 20, children, openable = true }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.measure((x, y, width, height) => {
        setContentHeight(height);
        setIsOverflowing(height > maxHeight);
      });
    }
  }, [children, maxHeight]);

  return (
    <View style={styles.main}>
      {openable ? (
        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <View style={[
          styles.container,
          {
            backgroundColor: color,
            borderRadius: borderRadius,
            maxHeight: maxHeight,
          }
        ]}>
          <View ref={contentRef}>
            {children}
          </View>
        </View>
      </TouchableOpacity>
      ) : (
        <View style={[
          styles.container,
          {
            backgroundColor: color,
            borderRadius: borderRadius,
            maxHeight: maxHeight,
          }
        ]}>
          <View ref={contentRef}>
            {children}
          </View>
        </View> 
      )
      }
      
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
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {children}
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
    minHeight: 50, // Minimum height to prevent collapse
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