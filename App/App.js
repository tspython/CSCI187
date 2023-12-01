import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RegistrationScreen from './RegistrationScreen';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import TravelPreferences from './TravelPreferences';
import UserProfile from './UserProfile';
import StartScreen from './StartScreen';
import Dashboard from './DashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartScreen" component={StartScreen}/>
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TravelPreferences" component={TravelPreferences} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const TravelPreferencesStack = () => {
  return (
    <Stack.Navigator initialRouteName="TravelPreferences" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TravelPreferences" component={TravelPreferences} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const UserProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="UserProfile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="DashboardStack"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
         tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Preferences"
        component={TravelPreferencesStack}
        options={{
          tabBarLabel: 'Preferences',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="adjust" color={color} size={size} />
          ),
        }}
      />
            <Tab.Screen
        name="UserProfileStack"
        component={UserProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <DashboardStack />
    </NavigationContainer>
  );
};

export default App;
