import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TravelPreferences = () => {
  const navigation = useNavigation();
  const [budget, setBudget] = useState(30);
  const [speed, setSpeed] = useState(5);
  const [safety, setSafety] = useState(10);

  useEffect(() => {
    AsyncStorage.getItem('budget').then((value) => {
      if (value) {
        setBudget(parseInt(value));
      }
    });
    AsyncStorage.getItem('speed').then((value) => {
      if (value) {
        setSpeed(parseInt(value));
      }
    });
    AsyncStorage.getItem('safety').then((value) => {
      if (value) {
        setSafety(parseInt(value));
      }
    });
  }, []);

  const handleSavePreferences = async() => {
    // Handle the save action, like updating the state or sending to a server
    await AsyncStorage.setItem('budget', `${budget}`);
    await AsyncStorage.setItem('speed',  `${speed}`);
    await AsyncStorage.setItem('safety',  `${safety}`);
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.preference}>
          <Text>Budget</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            value={budget}
            onValueChange={setBudget}
            minimumValue={1}
            maximumValue={300}
            step={1}
          />
          <Text>${budget}</Text>
        </View>

        <View style={styles.preference}>
          <Text>Speed</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            value={speed}
            onValueChange={setSpeed}
            minimumValue={0}
            maximumValue={5}
            step={1}
          />
          <Text>{`${speed}`}</Text>
        </View>

        <View style={styles.preference}>
          <Text>Safety</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            value={safety}
            onValueChange={setSafety}
            minimumValue={1}
            maximumValue={20}
            step={1}
          />
          <Text>{safety}</Text>
        </View>

        <Button title="Save" onPress={handleSavePreferences} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
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
