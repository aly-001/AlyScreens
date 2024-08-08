import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { useSettingsContext } from "../context/useSettingsContext";
import colors from '../config/colors';

const PromptEditModal = ({ isVisible, onClose, promptType, initialPrompt, greyPromptPart, onReset }) => {
  const { settings, updateSettings } = useSettingsContext();
  const [prompt, setPrompt] = useState(settings[promptType] || '');

  useEffect(() => {
    setPrompt(settings[promptType] || '');
  }, [settings, promptType]);

  const handleSave = () => {
    updateSettings({ [promptType]: prompt });
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.greyPartContainer}>
            <Text style={styles.greyPromptPart}>{greyPromptPart}</Text>
          </View>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            placeholder={`Enter ${promptType} prompt`}
          />
          <View style={styles.resetButtonContainer}>
            <Button title="Reset" onPress={onReset} color={colors.appleBlue} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  greyPartContainer: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  greyPromptPart: {
    opacity: 0.8,
    color: colors.utilityGrey,
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    textAlignVertical: 'top',
    backgroundColor: '#F2F2F7',
    padding: 10,
    marginBottom: 15,
  },
  resetButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.appleBlue,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.appleBlue,
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },

});

export default PromptEditModal;