const axios = require('axios');

const LYFT_API_URL = 'https://api.lyft.com/v1';

const getLyftRideEstimate = async (startLat, startLng, endLat, endLng, accessToken) => {
  try {
    const response = await axios.get(`${LYFT_API_URL}/cost`, {
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
    throw error;
  }
};

module.exports = {
  getLyftRideEstimate,
};

