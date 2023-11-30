import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';

const TravelPreferences = () => {
    const navigation = useNavigation();
  const [budget, setBudget] = useState(12);
  const [speed, setSpeed] = useState(25);
  const [safety, setSafety] = useState(24);

  const handleSavePreferences = () => {
    // Handle the save action, like updating the state or sending to a server
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Preferences</Text>
      
      <View style={styles.preference}>
        <Text>Budget</Text>
        <Slider
            style={{width: 200, height: 40}}
          value={budget}
          onValueChange={setBudget}
          minimumValue={1}
          maximumValue={100}
          step={1}
        />
        <Text>${budget}</Text>
      </View>
      
      <View style={styles.preference}>
        <Text>Speed</Text>
        <Slider
            style={{width: 200, height: 40}}
          value={speed}
          onValueChange={setSpeed}
          minimumValue={5}
          maximumValue={60}
          step={1}
        />
        <Text>{`<${speed}min`}</Text>
      </View>
      
      <View style={styles.preference}>
        <Text>Safety</Text>
        <Slider
          style={{width: 200, height: 40}}
          value={safety}
          onValueChange={setSafety}
          minimumValue={1}
          maximumValue={100}
          step={1}
        />
        <Text>{safety}</Text>
      </View>
      
      <Button
        title="Save"
        onPress={handleSavePreferences}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Additional styles for the sliders and buttons
});

export default TravelPreferences;
