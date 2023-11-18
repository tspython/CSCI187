const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add your BART API URL and key here
const BART_API_URL = 'https://api.bart.gov/api';

async function storeBARTStations() {
  try {
    const response = await axios.get(`${BART_API_URL}/stn.aspx`, {
      params: { cmd: 'stns', key: 'YOUR_BART_API_KEY' },
    });

    // Iterate over stations and store them
    for (const station of response.data.root.stations.station) {
      await prisma.bartStations.create({
        data: {
          name: station.name,
          abbr: station.abbr,
          // Add other fields as per your database schema
        },
      });
    }
  } catch (error) {
    console.error('Error storing BART stations:', error);
    throw error;
  }
}

module.exports = {
  storeBARTStations,
};
