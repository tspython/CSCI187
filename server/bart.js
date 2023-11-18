const axios = require('axios');

const BART_API_URL = 'https://api.bart.gov/api';

const getBARTStations = async () => {
  try {
    const response = await axios.get(`${BART_API_URL}/stn.aspx`, {
      params: {
        cmd: 'stns',
        key: 'YOUR_BART_API_KEY',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// TODO: Add more functions as needed for other BART API endpoints

module.exports = {
  getBARTStations,
};

