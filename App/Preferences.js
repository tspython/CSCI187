import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

// Constants
const PREFERENCES_URL = 'http://localhost:3000/user/preferences';

const PreferencesForm = () => {
  const [budget, setBudget] = useState('');
  const [safetyPriority, setSafetyPriority] = useState('');
  const [speedPriority, setSpeedPriority] = useState('');

  // Validate input as numeric
  const isNumeric = (value) => /^[0-9]+(\.[0-9]+)?$/.test(value);

  // Handle form submission
  const handleSubmit = async () => {
    if (!isNumeric(budget) || !isNumeric(safetyPriority) || !isNumeric(speedPriority)) {
      Alert.alert('Invalid Input', 'Please enter numeric values only.');
      return;
    }

    try {
      await axios.put(PREFERENCES_URL, {
        budget,
        safetyPriority,
        speedPriority
      });
      Alert.alert('Success', 'Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Failed to update preferences. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Budget"
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Safety Priority"
        value={safetyPriority}
        onChangeText={setSafetyPriority}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Speed Priority"
        value={speedPriority}
        onChangeText={setSpeedPriority}
        keyboardType="numeric"
      />
      <Button title="Update Preferences" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default PreferencesForm;
