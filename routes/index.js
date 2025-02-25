// routes/index.js


const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- Mongoose Models ---

// User model (Google-only)
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: String,
  email: { type: String, required: true, unique: true },
});
const User = mongoose.model('User', userSchema);

// Tracking Event model
const trackingEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  query: Object,
  userAgent: String,
  ip: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const TrackingEvent = mongoose.model('TrackingEvent', trackingEventSchema);

// --- Authentication Middleware ---

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

// --- Routes ---

// Root route
router.get('/', (req, res) => {
  res.send('Email Tracking Server is running');
});

// Tracking endpoint (public)
// This endpoint logs the tracking event and returns a 1x1 transparent PNG.
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
        // Invalid token; treat as unauthenticated
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

// Google OAuth endpoint (login)
// This endpoint receives a Google token, verifies it with Google,
// creates or finds a user in the database, and issues a custom JWT.
router.post('/auth/google', async (req, res) => {
  const { token } = req.body; // Token from frontend Google OAuth
  if (!token) return res.status(400).json({ error: 'No token provided' });
  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload; // sub is the Google user ID
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({
        googleId: sub,
        username: name,
        email,
      });
      await user.save();
    }
    const ourToken = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token: ourToken });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(500).json({ error: 'Internal server error' });
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
