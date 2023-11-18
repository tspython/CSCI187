const axios = require('axios');
const qs = require('querystring');

const LYFT_API_URL = 'https://api.lyft.com';
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your Client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Replace with your Client Secret

// Function to get an access token from Lyft
const getAccessToken = async () => {
  try {
    const response = await axios.post(`${LYFT_API_URL}/oauth/token`, qs.stringify({
      grant_type: 'client_credentials',
      scope: 'public'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      }
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to obtain access token: ' + error.message);
  }
};

// Function to get a ride estimate from Lyft
const getLyftRideEstimate = async (startLat, startLng, endLat, endLng, accessToken) => {
  if (!startLat || !startLng || !endLat || !endLng) {
    throw new Error('Invalid coordinates provided.');
  }
  if (!accessToken) {
    throw new Error('Access token is required.');
  }

  try {
    const response = await axios.get(`${LYFT_API_URL}/v1/cost`, {
      params: {
        start_lat: startLat,
        start_lng: startLng,
        end_lat: endLat,
        end_lng: endLng,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response from API:', error.response.data);
      throw new Error(`API responded with status ${error.response.status}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from API');
    } else {
      console.error('Error setting up API request:', error.message);
      throw error;
    }
  }
};

// Main function to execute the API calls
const main = async () => {
  try {
    const accessToken = await getAccessToken();
    const rideEstimate = await getLyftRideEstimate(START_LAT, START_LNG, END_LAT, END_LNG, accessToken);
    console.log('Ride Estimate:', rideEstimate);
  } catch (error) {
    console.error(error.message);
  }
};
