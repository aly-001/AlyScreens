import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { useSettingsContext} from "../context/useSettingsContext";
import colors from '../config/colors';
import { Divider } from 'react-native-paper';

const PromptEditModal = ({ isVisible, onClose, promptType, initialPrompt, greyPromptPart, onReset}) => {
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
          <View style={{alignSelf: "flex-start"}}>

            <Button title="Reset"  onPress={onReset}/>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
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
    padding: 35,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 100,
    borderRadius: 5,
     textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: colors.appleBlue,
    borderRadius: 5,
    paddingVertical: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.appleBlue,
    paddingVertical: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: colors.appleBlue, 

    fontWeight: 'bold',
    textAlign: 'center',
  },
  greyPromptPart: {
    opacity: .8,
    color: colors.utilityGrey,
    fontStyle: 'italic',
  },
  greyPartContainer:{
    alignSelf: "flex-start",
    marginBottom: 15  
  }
});

export default PromptEditModal;