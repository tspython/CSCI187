import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('********'); // Password is initially hidden
  const navigation = useNavigation();


  useEffect(() => {
    AsyncStorage.getItem('user').then((value) => {
      if (value) {
        setEmail(value);
        AsyncStorage.getItem(value).then((value) => {
          setPassword(value);
        });
      }
    });
  }, [])
  const handleLogout = async() => {
    // Logout logic here
    await AsyncStorage.removeItem('user');
    navigation.navigate('StartScreen');
    console.log('Logout pressed');
  };
  return (
    <View style={styles.container}>
        <Image
          source={{ uri: 'https://bunnynet-avatars.b-cdn.net/.ai/img/dalle-256/avatar/hello@gmail.com/rabbit.jpg?width=256' }} // Replace with your profile image URI
          style={styles.profileImage}
        />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        secureTextEntry={true} // Hides the entered text
      />
       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 256,
    height: 256,
    borderRadius: 256,
    marginBottom: 70,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  logoutButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute', // Position the button at the bottom
    bottom: 10, // Spacing from the bottom
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UserProfile;
