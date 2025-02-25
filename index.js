// // backend/index.js

// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const app = express();

// // Replace with your MongoDB Atlas connection string (use environment variables for security)
// const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://realitynuel:VpF4ejMHPQrvZ6gw@emailtracking.1xgja.mongodb.net/';

// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on('error', (err) => console.error('MongoDB connection error:', err));
// db.once('open', () => console.log('Connected to MongoDB'));

// // Define a Mongoose schema and model for tracking events
// const trackingEventSchema = new mongoose.Schema({
//   timestamp: { type: Date, default: Date.now },
//   query: Object,
//   userAgent: String,
//   ip: String,
// });
// const TrackingEvent = mongoose.model('TrackingEvent', trackingEventSchema);

// app.use(cors());
// app.use(morgan('dev'));

// // GET /track endpoint: log event and return 1x1 transparent PNG
// app.get('/track', async (req, res) => {
//   try {
//     const event = new TrackingEvent({
//       query: req.query,
//       userAgent: req.headers['user-agent'],
//       ip: req.ip,
//     });
//     await event.save();
//     console.log('Tracking event logged:', event);

//     const pixel = Buffer.from(
//       "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAR9rLhEAAAAASUVORK5CYII=",
//       "base64"
//     );

//     res.writeHead(200, {
//       "Content-Type": "image/png",
//       "Content-Length": pixel.length,
//       "Cache-Control": "no-cache, no-store, must-revalidate",
//       "Pragma": "no-cache",
//       "Expires": "0"
//     });
//     res.end(pixel);
//   } catch (error) {
//     console.error('Error in /track:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // GET /analytics endpoint: return aggregated analytics
// app.get('/analytics', async (req, res) => {
//   try {
//     const count = await TrackingEvent.countDocuments();
//     res.json({ opens: count, clicks: 0 });
//   } catch (error) {
//     console.error('Error in /analytics:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // GET /events endpoint: return recent tracking events
// app.get('/events', async (req, res) => {
//   try {
//     const events = await TrackingEvent.find().sort({ timestamp: -1 });
//     res.json(events);
//   } catch (error) {
//     console.error('Error in /events:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Global error handler middleware (optional)
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).send('Something broke!');
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Tracking server is running on port ${PORT}`);
// });




// index.js

// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;
// const MONGO_URI = process.env.MONGO_URI;

// // Connect to MongoDB using Mongoose
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', (err) => console.error('MongoDB connection error:', err));
// db.once('open', () => console.log('Connected to MongoDB'));

// // Define a schema and model for tracking events
// const trackingEventSchema = new mongoose.Schema({
//   timestamp: { type: Date, default: Date.now },
//   query: Object,
//   userAgent: String,
//   ip: String,
// });
// const TrackingEvent = mongoose.model('TrackingEvent', trackingEventSchema);

// // Middleware
// app.use(cors());
// app.use(morgan('dev'));

// // Basic authentication middleware to secure endpoints
// function basicAuth(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     res.setHeader('WWW-Authenticate', 'Basic realm="401"');
//     return res.status(401).send('Authentication required.');
//   }

//   // Parse base64 encoded credentials
//   const base64Credentials = authHeader.split(' ')[1];
//   const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//   const [username, password] = credentials.split(':');

//   // Validate credentials against environment variables
//   const expectedUsername = process.env.BASIC_AUTH_USERNAME || 'admin';
//   const expectedPassword = process.env.BASIC_AUTH_PASSWORD || 'secret';

//   if (username === expectedUsername && password === expectedPassword) {
//     return next();
//   } else {
//     res.setHeader('WWW-Authenticate', 'Basic realm="401"');
//     return res.status(401).send('Authentication required.');
//   }
// }

// /**
//  * GET /track
//  * Logs a tracking event and returns a 1x1 transparent PNG.
//  */
// app.get('/track', async (req, res) => {
//   try {
//     const event = new TrackingEvent({
//       query: req.query, // e.g., email_id and other params
//       userAgent: req.headers['user-agent'],
//       ip: req.ip, // may appear as ::1 locally
//     });
//     await event.save();
//     console.log('Tracking event logged:', event);

//     // 1x1 transparent PNG in Base64
//     const pixel = Buffer.from(
//       "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAR9rLhEAAAAASUVORK5CYII=",
//       "base64"
//     );

//     res.writeHead(200, {
//       "Content-Type": "image/png",
//       "Content-Length": pixel.length,
//       "Cache-Control": "no-cache, no-store, must-revalidate",
//       "Pragma": "no-cache",
//       "Expires": "0"
//     });
//     res.end(pixel);
//   } catch (error) {
//     console.error('Error in /track:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// /**
//  * GET /analytics
//  * Returns aggregated analytics data.
//  * This endpoint is secured via basic auth.
//  */
// app.get('/analytics', basicAuth, async (req, res) => {
//   try {
//     const count = await TrackingEvent.countDocuments();
//     res.json({ opens: count, clicks: 0 });
//   } catch (error) {
//     console.error('Error in /analytics:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// /**
//  * GET /events
//  * Returns recent tracking events (most recent first).
//  * This endpoint is secured via basic auth.
//  */
// app.get('/events', basicAuth, async (req, res) => {
//   try {
//     const events = await TrackingEvent.find().sort({ timestamp: -1 });
//     res.json(events);
//   } catch (error) {
//     console.error('Error in /events:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Global error handler (optional)
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).send('Something broke!');
// });

// app.listen(PORT, () => {
//   console.log(`Tracking server is running on port ${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // must be set in .env

// Middleware to parse JSON bodies
app.use(express.json());

// Set up CORS so that requests from your frontend (http://localhost:5173) are allowed
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('Connected to MongoDB'));

// =======================
// Mongoose Schemas/Models
// =======================

// User Schema for Google-only authentication
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: String,
  email: { type: String, required: true, unique: true },
});
const User = mongoose.model('User', userSchema);

// Tracking Event Schema
const trackingEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  query: Object,
  userAgent: String,
  ip: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const TrackingEvent = mongoose.model('TrackingEvent', trackingEventSchema);

// =======================
// Google OAuth Setup
// =======================
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// =======================
// JWT Authentication Helper
// =======================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded; // { userId, email, username }
    next();
  });
}

// =======================
// Google OAuth Endpoint
// =======================
app.post('/auth/google', async (req, res) => {
  const { token } = req.body; // token from frontend Google OAuth
  if (!token) return res.status(400).json({ error: 'No token provided' });

  try {
    // Verify the token with Google
    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload; // sub is the Google user ID

    // Check if the user exists; if not, create one
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({
        googleId: sub,
        username: name,
        email,
      });
      await user.save();
    }

    // Create our own JWT token (valid for 1 hour)
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

// =======================
// Tracking Endpoint (Public)
// =======================
app.get('/track', async (req, res) => {
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

    // Return a 1x1 transparent PNG
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

// =======================
// Secured Endpoints (Per-User Data)
// =======================
app.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const count = await TrackingEvent.countDocuments({ user: req.user.userId });
    res.json({ opens: count, clicks: 0 });
  } catch (error) {
    console.error('Error in /analytics:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/events', authenticateToken, async (req, res) => {
  try {
    const events = await TrackingEvent.find({ user: req.user.userId }).sort({ timestamp: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error in /events:', error);
    res.status(500).send('Internal Server Error');
  }
});

// =======================
// Global Error Handler (Optional)
// =======================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
