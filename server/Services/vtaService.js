const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add your VTA API URL here
const VTA_API_URL = 'https://api.vta.org';

async function storeVTAStops() {
  try {
    const response = await axios.get(`${VTA_API_URL}/stops`);

    // Iterate over stops and store them
    for (const stop of response.data) {
      await prisma.vtaStops.create({
        data: {
          id: stop.id,
          name: stop.name,
          // Add other fields as per your database schema
        },
      });
    }
  } catch (error) {
    console.error('Error storing VTA stops:', error);
    throw error;
  }
}

module.exports = {
  storeVTAStops,
};
