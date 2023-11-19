import React from 'react';
import { View, Text } from 'react-native';

const ResultsPage = ({ route }) => {
  const { routes, preferences } = route.params;

  // Display the results and preferences
  return (
    <View>
      <Text>Results:</Text>
      {routes.map((route, index) => (
        <View key={index} style={styles.routeContainer}>
          <Text>Route {index + 1}:</Text>
          <Text>{/* Display route details, e.g., duration, cost, etc. */}</Text>
        </View>
      ))}

      <Text>Preferences:</Text>
      <Text>{JSON.stringify(preferences)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    routeContainer: {
      marginVertical: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
});

export default ResultsPage;