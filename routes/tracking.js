// routes/tracking.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// TrackingEvent Schema
const trackingEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  query: Object,
  userAgent: String,
  ip: String,
  // Optional: Reference to a user (if available)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const TrackingEvent = mongoose.model('TrackingEvent', trackingEventSchema);

// Authentication middleware for secured endpoints
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded; // contains { userId, email, username }
    next();
  });
}

// Root route
router.get('/', (req, res) => {
  res.send('Email Tracking Server is running');
});

// Tracking endpoint (public)
// Logs a tracking event and returns a 1x1 transparent PNG.
router.get('/track', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Invalid token; proceed as unauthenticated
      }
    }
    const event = new TrackingEvent({
      query: req.query,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      user: userId,
    });
    await event.save();
    console.log('Tracking event logged:', event);
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAR9rLhEAAAAASUVORK5CYII=",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": pixel.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.end(pixel);
  } catch (error) {
    console.error('Error in /track:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Secured analytics endpoint (returns per-user data)
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const count = await TrackingEvent.countDocuments({ user: req.user.userId });
    res.json({ opens: count, clicks: 0 });
  } catch (error) {
    console.error('Error in /analytics:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Secured events endpoint (returns per-user tracking events)
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const events = await TrackingEvent.find({ user: req.user.userId }).sort({ timestamp: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error in /events:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
