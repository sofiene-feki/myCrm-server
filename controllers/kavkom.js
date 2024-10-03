// controllers/callController.js

const { URL } = require('url'); // In case URL is not supported natively in Node.js

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Function to handle initiating a call
exports.initiateCall = async (req, res) => {
  const { src, destination } = req.body;

  // Kavkom API endpoint and params
  const KAVKOM_API_URL = 'http://api.kavkom.com/api/pbx/v1/active_call/call';
  const API_TOKEN =
    'HvrkZqzfbOiP9BJBe7b2yRHa8mHhHiuAkKJdaxXBviq3ZD30wD1OeKRJwW4sdC5nXNsRnVtq7V5GerBpjFGoNvXg3K4ouxoXRpUutsGiny7jrZmsC6N9ttm1KBR5rzcS'; // Store the token in .env for security

  const params = {
    domain_uuid: 'be257612-642f-4008-a75b-7fefefa34013', // Replace this with your actual domain UUID
    src: src,
    destination: destination,
  };

  // Construct the URL with search params
  const url = new URL(KAVKOM_API_URL);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const headers = {
    'X-API-TOKEN': API_TOKEN,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    // Make the API request to Kavkom
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
    });

    // Convert the response to JSON
    const data = await response.json();

    // Send the response back to the client
    res.status(200).json(data);
  } catch (error) {
    console.error('Error initiating call:', error.message || error); // Log the error message or full error object

    // Send the error message in the response for debugging purposes
    res.status(500).json({
      error: 'Failed to initiate the call',
      message: error.message || 'An unexpected error occurred', // Send the error message if available
    });
  }
};
