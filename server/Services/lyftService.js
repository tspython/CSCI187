const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add your Lyft API URL and access token here
const LYFT_API_URL = 'https://api.lyft.com/v1';

async function storeLyftRideEstimate(startLat, startLng, endLat, endLng, accessToken) {
  try {
    const response = await axios.get(`${LYFT_API_URL}/cost`, {
      params: { start_lat: startLat, start_lng: startLng, end_lat: endLat, end_lng: endLng },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Store response in the database
    const lyftRide = await prisma.trip.create({
        data: {
          service_provider: 'Lyft',
          pickup_latitude: startLat,
          pickup_longitude: startLng,
          dropoff_latitude: endLat,
          dropoff_longitude: endLng,
          cost_estimate: response.data.cost_estimates[0].estimated_cost_cents_min / 100, // Assuming the cost is in cents
          requested_at: new Date(), // Assuming the request time is now
          user_id: userId, // Assuming you're passing the user ID
        },
      });
      
    return lyftRide;
  } catch (error) {
    console.error('Error storing Lyft ride estimate:', error);
    throw error;
  }
}

module.exports = {
  storeLyftRideEstimate,
};
