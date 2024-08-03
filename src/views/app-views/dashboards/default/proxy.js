const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // Port for the proxy server

app.use(express.json());

app.post('/api/anthropic', async (req, res) => {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', req.body, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_ANTHROPIC_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error communicating with the Anthropic API');
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
