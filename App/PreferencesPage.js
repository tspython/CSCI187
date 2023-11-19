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
        alert('Failed to load preferences.');
      }
    };

    loadPreferences();
  }, []);
  
  const handleSavePreferences = async () => {
    try {
      const preferences = {
        isFastestRoute: isFastestRoute,
        budget: budget
      };
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem('preferences', jsonValue);
    alert('Preferences saved!');
  } catch (e) {
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