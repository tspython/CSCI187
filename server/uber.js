const Uber = require('node-uber');
const uber = new Uber({
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET',
  server_token: 'YOUR_SERVER_TOKEN',
  name: 'Your App Name',
  language: 'en_US',
});

async function getCurrentRide(userAccessToken) {
  try {
    const rideInfo = await uber.user.getUserActivity(userAccessToken);
    return rideInfo;
  } catch (error) {
    throw new Error('Error fetching ride information from Uber API');
  }
}

module.exports = {
  getCurrentRide,
};
