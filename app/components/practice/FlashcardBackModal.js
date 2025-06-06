import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../config/colors';
import layout from '../../config/layout';
import FlashcardModuleBox from './FlashcardModuleBox';
import FlashcardModuleBoxGeneral from './FlashcardModuleBoxGeneral';
import PracticeAudio from './PracticeAudio';
import Markdown from 'react-native-markdown-display';

const { width, height } = Dimensions.get('window');

const FlashcardBackModal = ({ visible, card, onClose }) => {
  const colors = useThemeColors();
  const [imageUri, setImageUri] = useState(null);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  useEffect(() => {
    async function loadImage() {
      if (card && card.back) {
        try {
          const backData = JSON.parse(card.back[0]);
          const imageFileName = backData.imageID + '.png';
          const imagePath = `${FileSystem.documentDirectory}images/${imageFileName}`;

          const fileInfo = await FileSystem.getInfoAsync(imagePath);
          if (fileInfo.exists) {
            setImageUri(imagePath);
          } else {
            setImageUri(null);
          }
        } catch (error) {
          console.error('Error loading image:', error);
          setImageUri(null);
        }
      }
    }

    loadImage();
  }, [card]);

  const renderCardContent = () => {
    if (!card) return <Text>No card available</Text>;
    let backData;
    try {
      backData = JSON.parse(card.back[0]);
    } catch (error) {
      console.error('Error parsing card data:', error);
      return <Text>Error: Could not parse card data</Text>;
    }
    if (!backData || typeof backData !== 'object') {
      console.error('Invalid card data format');
      return <Text>Error: Invalid card data format</Text>;
    }
    return (
      <View style={styles.modulesContainer}>
        <FlashcardModuleBoxGeneral color={colors.mainComponentBackground} openable={false}>
          <View style={[styles.wordContainer]}>
            <Text style={[styles.word, { color: colors.utilityGrey }]}>{backData.word || 'N/A'}</Text>
            {backData.audioWordID && (
              <TouchableOpacity
                style={styles.audioButton}
                onPress={() => {/* Audio functionality */}}
                activeOpacity={0.8}
              >
                <PracticeAudio />
              </TouchableOpacity>
            )}
          </View>
          {backData.wordDef && (
            <Text style={[styles.wordDef, {color: colors.utilityGrey}]}>{backData.wordDef}</Text>
          )}
        </FlashcardModuleBoxGeneral>

        {(backData.context || backData.audioContextID) && (
          <FlashcardModuleBoxGeneral
            openable={false}
            color={colors.translationPopup.contextModuleShade}
          >
            <View>
              {backData.context && (
                <Text style={[styles.context, {color: colors.utilityGrey}]}>"{backData.context}"</Text>
              )}
              {backData.audioContextID && (
                <TouchableOpacity
                  onPress={() => {/* Audio functionality */}}
                  activeOpacity={0.8}
                  style={styles.audioButton}
                >
                  <PracticeAudio />
                </TouchableOpacity>
              )}
              {backData.contextDef && (
                <Text style={[styles.contextDef, {color: colors.utilityGrey}]}>{backData.contextDef}</Text>
              )}
            </View>
          </FlashcardModuleBoxGeneral>
        )}

        {backData.grammarExplanation && (
          <FlashcardModuleBoxGeneral
            color={colors.translationPopup.grammarModuleShade}
          >
            <Markdown
              style={{
                body: { color: colors.utilityGrey },
                heading1: { color: colors.utilityGrey },
                heading2: { color: colors.utilityGrey },
                heading3: { color: colors.utilityGrey },
                heading4: { color: colors.utilityGrey },
                heading5: { color: colors.utilityGrey },
                heading6: { color: colors.utilityGrey },
                paragraph: { color: colors.utilityGrey },
                link: { color: colors.appleBlue },
                list: { color: colors.utilityGrey },
                listItem: { color: colors.utilityGrey },
                strong: { color: colors.utilityGrey },
                em: { color: colors.utilityGrey },
              }}
            >{backData.grammarExplanation}</Markdown>
          </FlashcardModuleBoxGeneral>
        )}
        {backData.moduleA && (
          <FlashcardModuleBox
            text={backData.moduleA}
            color={colors.translationPopup.moduleAModuleShade}
          />
        )}
        {backData.moduleB && (
          <FlashcardModuleBox
            text={backData.moduleB}
            color={colors.translationPopup.moduleBModuleShade}
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalWrapper}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View style={styles.closeButtonCircle}>
              <Ionicons name="close" size={28} color={colors.utilityGrey} />
            </View>
          </TouchableOpacity>
          <View style={styles.modalContainer}>
            <BlurView intensity={100} style={[StyleSheet.absoluteFill, styles.blurViewStyle]}>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {imageUri && (
                  <ImageBackground
                    source={{ uri: imageUri }}
                    style={styles.backgroundImage}
                    blurRadius={5}
                  >
                    <BlurView intensity={30} style={StyleSheet.absoluteFill}>
                      <View style={styles.lightTintOverlay} />
                      <TouchableOpacity
                        onPress={() => setFullscreenVisible(true)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="contain"
                          />
                        </View>
                      </TouchableOpacity>
                    </BlurView>
                  </ImageBackground>
                )}
                {renderCardContent()}
              </ScrollView>
            </BlurView>
          </View>
        </View>
      </View>
      <Modal
        visible={fullscreenVisible}
        transparent={true}
        animationType="fade"
      >
        <ImageBackground
          source={{ uri: imageUri }}
          style={styles.modalBackgroundImage}
          blurRadius={10}
        >
          <BlurView intensity={100} style={StyleSheet.absoluteFill}>
            <View style={styles.fullscreenModalContainer}>
              <TouchableOpacity
                style={styles.closeButtonImage}
                onPress={() => setFullscreenVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: imageUri }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            </View>
          </BlurView>
        </ImageBackground>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: '85%',
    height: '85%',
    position: 'relative',
  },
  modalContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurViewStyle: {
    borderRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: layout.components.flashcardBackModal.closeButtonOffset,
    right: layout.components.flashcardBackModal.closeButtonOffset,
    zIndex: 1,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonImage: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: layout.flashCards.image.width,
  },
  lightTintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: layout.flashCards.image.width, 
    height: layout.flashCards.image.width,
  },
  modulesContainer: {
    width: '90%',
    maxWidth: 600,
    marginTop: 20,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  word: {
    fontSize: layout.flashCards.fontSize.word,
    fontWeight: '600',
    marginBottom: 10,
  },
  wordDef: {
    fontSize: layout.flashCards.fontSize.flashcardModuleBox,
    fontStyle: 'italic',
  },
  context: {
    fontSize: layout.flashCards.fontSize.flashcardModuleBox,
    marginBottom: 10,
  },
  contextDef: {
    fontSize: layout.flashCards.fontSize.flashcardModuleBox,
    fontStyle: 'italic',
  },
  audioButton: {
    alignSelf: 'flex-start',
  },
  modalBackgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fullscreenModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
  },
});

export default FlashcardBackModal;
