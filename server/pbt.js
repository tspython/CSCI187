const { Client } = require('@googlemaps/google-maps-services-js');

const googleMapsClient = new Client({});

async function getPublicTransportDirections(origin, destination) {
  try {
    const directions = await googleMapsClient.directions({
      params: {
        origin,
        destination,
        mode: 'transit', // Specify the mode of transportation
        transit_mode: 'bus|subway|train', // Specify transit mode(s) you prefer
        alternatives: true, // To get multiple route options
        key: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
      },
    });

    return directions.data.routes.map(route => {
      const { summary, legs } = route;
      const totalTime = legs.reduce((acc, leg) => acc + leg.duration.value, 0);
      const totalDistance = legs.reduce((acc, leg) => acc + leg.distance.value, 0);

      return {
        summary,
        totalTime, // Total time in seconds
        totalDistance, // Total distance in meters
      };
    });
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
}

const origin = 'Starting point';
const destination = 'Destination point';

getPublicTransportDirections(origin, destination)
  .then(directions => {
    console.log('Public transport directions:', directions);
    // Process the directions as needed
  })
  .catch(error => {
    console.error('Error:', error);
  });

