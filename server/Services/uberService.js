const Uber = require('node-uber');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure with actual credentials
const uber = new Uber({
  client_id: process.env.UBER_CLIENT_ID,
  client_secret: process.env.UBER_CLIENT_SECRET,
  server_token: process.env.UBER_SERVER_TOKEN,
  name: 'Travel Planner',
  language: 'en_US',
});

// Function to fetch and store trip data
async function fetchAndStoreUberRides(userAccessToken) {
  try {
    const rideInfo = await uber.user.getUserActivity(userAccessToken);
    // Assume rideInfo is an array of ride objects
    for (const ride of rideInfo.history) {
      await prisma.trips.create({
        data: {
            service_provider: 'Uber',
            pickup_latitude: ride.start_city.latitude,
            pickup_longitude: ride.start_city.longitude,
            dropoff_latitude: ride.end_city.latitude, // You will need to adjust these according to the actual response structure
            dropoff_longitude: ride.end_city.longitude,
            duration: ride.duration,
            distance: ride.distance,
            cost_estimate: ride.cost, // This may require calculation
            requested_at: new Date(ride.request_time * 1000), // Converting UNIX timestamp to JavaScript Date object
        },
      });
    }
  } catch (error) {
    console.error('Error fetching or storing Uber ride info:', error);
    throw error;
  }
}

module.exports = {
  fetchAndStoreUberRides,
};
