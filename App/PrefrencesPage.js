import React, { useState } from 'react';
import { View, Text, Switch, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreferencesScreen = () => {
  const [isFastestRoute, setIsFastestRoute] = useState(false);
  const [budget, setBudget] = useState('');
 
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('preferences');
        if (jsonValue != null) {
          const preferences = JSON.parse(jsonValue);
          setIsFastestRoute(preferences.isFastestRoute);
          setBudget(preferences.budget);
        }
      } catch (e) {
        // If there was an error loading the preferences, you might want to handle it here
        alert('Failed to load preferences.');
      }
    };

    loadPreferences();
  }, []);
  
  const handleSavePreferences = async () => {
    try {
      // Create a preferences object
      const preferences = {
        isFastestRoute: isFastestRoute,
        budget: budget
      };
    // Convert the preferences object to a string
    const jsonValue = JSON.stringify(preferences);

    // Save the preferences string to AsyncStorage under the key 'preferences'
    await AsyncStorage.setItem('preferences', jsonValue);

    //provide  feedback to the user
    alert('Preferences saved!');
  } catch (e) {
    // Saving failed, handle the error
    alert('Failed to save preferences.');
  }
};
  return (
    <View>
      <Text>Choose your preferences:</Text>

      <View>
        <Text>Prefer fastest route:</Text>
        <Switch
          onValueChange={setIsFastestRoute}
          value={isFastestRoute}
        />
      </View>

      <View>
        <Text>Budget:</Text>
        <TextInput
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />
      </View>

      <Button
        title="Save Preferences"
        onPress={handleSavePreferences}
      />
    </View>
  );
};

export default PreferencesScreen;
