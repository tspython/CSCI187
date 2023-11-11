import React, { useState } from 'react';
import { View, Text, Switch, TextInput, Button } from 'react-native';

const PreferencesScreen = () => {
  const [isFastestRoute, setIsFastestRoute] = useState(false);
  const [budget, setBudget] = useState('');

  const handleSavePreferences = () => {
    // Logic to save preferences
    // This might involve setting a global state, storing to AsyncStorage, or sending to an API
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
