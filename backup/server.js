require('dotenv').config();
const express = require('express');
const path = require('path');
const analyzeHandler = require('./api/analyze');

const app = express();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Serve static files from the current directory (index.html, etc.)
app.use(express.static(__dirname));

// Route for the analyze API
app.post('/api/analyze', async (req, res) => {
  await analyzeHandler(req, res);
});

// Fallback to index.html for any other route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
