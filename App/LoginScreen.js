import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: email,
        password: password,
      });
      
      const token = response.data.token; // Assuming the server returns a token
      // Save the token to AsyncStorage or any other secure storage method
      // Example using AsyncStorage:
      await AsyncStorage.setItem('authToken', token);

      console.log(response.data);
      navigation.navigate('Dashboard'); // Navigate to the Dashboard screen
    } catch (error) {
      console.error(error);
      // Handle login error here
      // Example: show an error message
    }
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

