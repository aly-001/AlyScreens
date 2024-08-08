import React, {useState} from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useAPIKey } from '../../context/APIKeyContext';

export default APIKeyConfigScreen = () => {
  const { apiKey, updateAPIKey, removeAPIKey } = useAPIKey();
  const [newKey, setNewKey] = useState('');

  const handleSaveKey = async () => {
    if (newKey) {
      const success = await updateAPIKey(newKey);
      if (success) {
        Alert.alert('Success', 'API key saved successfully');
        setNewKey('');
      } else {
        Alert.alert('Error', 'Failed to save API key');
      }
    }
  };

  const handleRemoveKey = async () => {
    const success = await removeAPIKey();
    if (success) {
      Alert.alert('Success', 'API key removed successfully');
    } else {
      Alert.alert('Error', 'Failed to remove API key');
    }
  };

  return (
    <View>
      <TextInput
        value={newKey}
        onChangeText={setNewKey}
        placeholder="Enter new API key"
        secureTextEntry
      />
      <Button title="Save API Key" onPress={handleSaveKey} />
      {apiKey && <Button title="Remove API Key" onPress={handleRemoveKey} />}
    </View>
  );
};