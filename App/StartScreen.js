import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StartScreen = () => {
    useEffect(() => {
        AsyncStorage.getItem('user').then((value) => {
            if (value) {
                navigation.navigate('Dashboard');
            }
        });
    }, [])
    
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://cdn-icons-png.flaticon.com/256/44/44386.png'}} // Replace with the path to your globe logo
        style={styles.logo}
      />
      <Text style={styles.title}>Journey Made Simple</Text>
      <TouchableOpacity style={styles.buttonApple} onPress={()=>{
        navigation.navigate('Login');
      }}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonApple} onPress={()=>{
        navigation.navigate('Registration');
      }}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 70,
  },
  buttonApple: {
    backgroundColor: 'black', // Use the appropriate color for Apple sign-in
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 7,
  },
  buttonGoogle: {
    backgroundColor: 'white', // Use the appropriate color for Google sign-in
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonCreateAccount: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default StartScreen;
