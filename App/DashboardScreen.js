import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
//import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      //const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login');
      } else {
        try {
          const response = await axios.get('http://localhost:3000/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error(error);
          navigation.navigate('Login');
        }
      }
    };

    checkToken();
  }, [navigation]);

  const handleLogout = async () => {
    //await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your dashboard!</Text>
      {user && <Text style={styles.userInfo}>Email: {user.email}</Text>}

      <MapView
        provider={PROVIDER_GOOGLE} // Use Google Maps
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.routeButton}
          onPress={() => navigation.navigate('RouteSearch')}
        >
          <Text style={styles.buttonText}>Search Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  routeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DashboardScreen;
