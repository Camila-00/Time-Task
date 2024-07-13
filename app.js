const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON and URL encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Spotify API credentials from .env file
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || `http://localhost:${port}/callback`;

// Create an instance of axios with increased timeout
const axiosInstance = axios.create({
  timeout: 10000, // Increase timeout to 10 seconds
});

// Route to render the index.ejs file
app.get('/', (req, res) => {
  res.render('index');
});

// Route to initiate Spotify authentication
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email'; // Add any necessary scopes
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri
  })}`);
});

// Route to handle Spotify callback
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    if (!code) {
      throw new Error('Code not found');
    }

    // Exchange code for access token
    const tokenResponse = await axiosInstance.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id,
      client_secret
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const access_token = tokenResponse.data.access_token;

    // Use the access token to get user data
    const userResponse = await axiosInstance.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const userData = userResponse.data;

    // Render a page or redirect as needed after successful authentication
    res.render('callback', { userData });

  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
