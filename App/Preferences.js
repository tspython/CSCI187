import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const PreferencesForm = () => {
  const [budget, setBudget] = useState('');
  const [safetyPriority, setSafetyPriority] = useState('');
  const [speedPriority, setSpeedPriority] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.put('http://localhost:3000/user/preferences', {
        budget,
        safetyPriority,
        speedPriority
      });
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
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
