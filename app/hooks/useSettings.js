import { useState, useEffect } from 'react';
   import AsyncStorage from '@react-native-async-storage/async-storage';

   const useSettings = () => {
     const [settings, setSettings] = useState({
       generateImage: true,
       generateAudioWord: true,
       generateAudioContext: true,
       languageTag: 'en-US',
     });

     useEffect(() => {
       loadSettings();
     }, []);

     const loadSettings = async () => {
       try {
         const storedSettings = await AsyncStorage.getItem('userSettings');
         if (storedSettings) {
           setSettings(JSON.parse(storedSettings));
         }
       } catch (error) {
         console.error('Error loading settings:', error);
       }
     };

     const updateSettings = async (newSettings) => {
       try {
         const updatedSettings = { ...settings, ...newSettings };
         await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
         setSettings(updatedSettings);
       } catch (error) {
         console.error('Error saving settings:', error);
       }
     };

     return { settings, updateSettings };
   };

   export default useSettings;