# Lyft API Integration in Node.js

This Node.js application demonstrates how to integrate the Lyft API to obtain a ride estimate using the Lyft `cost` endpoint. It includes obtaining an OAuth 2.0 access token and making a request to the Lyft API with the required parameters.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js installed on your system.
- A Lyft developer account.
- A registered application in the Lyft developer portal, which will provide you with a Client ID and Client Secret.

## Configuration

1. Open the main JavaScript file in the project.
2. Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with your Lyft Client ID and Client Secret.
3. Set the start and end coordinates (`START_LAT`, `START_LNG`, `END_LAT`, `END_LNG`) to your desired locations.

## How It Works

1. **Obtaining an Access Token**: The application first makes a POST request to the Lyft OAuth endpoint to obtain an access token. This token is required for making requests to the Lyft API.

2. **Requesting a Ride Estimate**: Once the access token is obtained, the application then makes a GET request to the `/v1/cost` endpoint of the Lyft API. The request includes start and end coordinates for the ride.

3. **Handling Responses**: The application processes the response from the Lyft API and outputs the ride estimate information.

4. **Error Handling**: The application includes basic error handling for scenarios like invalid input, failure to obtain an access token, or errors returned from the Lyft API.

## Note

- The access token obtained is valid for a limited time. In a production environment, implement a mechanism to refresh the token as needed.
- Always ensure your application complies with Lyft's API terms of use.