const axios = require('axios');

const VTA_API_URL = 'https://api.vta.org';

const getVTAStops = async () => {
  try {
    const response = await axios.get(`${VTA_API_URL}/v3/stops`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// TODO: Add more functions as needed for other VTA API endpoints

module.exports = {
  getVTAStops,
};

