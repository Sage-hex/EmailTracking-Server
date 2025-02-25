// routes/index.js

const express = require('express');
const router = express.Router();

// Root route - returns a simple message indicating the service is running.
router.get('/', (req, res) => {
  res.send('Email Tracking Server is running');
});

// /track route - logs a tracking event and returns a 1x1 transparent PNG.
router.get('/track', async (req, res) => {
  try {
    // Here you would log the tracking event (e.g., to your database)
    // For now, we'll just print to the console.
    console.log('Received /track request with query:', req.query);
    
    // Create a 1x1 transparent PNG (Base64-encoded)
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAR9rLhEAAAAASUVORK5CYII=",
      "base64"
    );
    
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": pixel.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    res.end(pixel);
  } catch (error) {
    console.error('Error in /track:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the router
module.exports = router;
