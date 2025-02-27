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


// 


// index.js

// index.js

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const mongoose = require('mongoose');

// const app = express();
// const PORT = process.env.PORT || 3001;
// const MONGO_URI = process.env.MONGO_URI;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Global CORS middleware: Allow all origins for development.
// // (For production, restrict to your frontend's origin.)
// app.use(cors());

// // Explicitly handle OPTIONS requests (preflight)
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(morgan('dev'));

// // Connect to MongoDB
// mongoose.connect(MONGO_URI);
// const db = mongoose.connection;
// db.on('error', (err) => console.error('MongoDB connection error:', err));
// db.once('open', () => console.log('Connected to MongoDB'));

// // Mount routes
// const routes = require('./routes');
// app.use('/', routes);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// // main indexjs

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const mongoose = require('mongoose');

// const app = express();
// const PORT = process.env.PORT || 3001;
// const MONGO_URI = process.env.MONGO_URI;

// // Parse JSON bodies
// app.use(express.json());

// // Set up CORS options explicitly for your Vercel domain
// const corsOptions = {
//   origin: "https://emailtracker-eta.vercel.app", // allowed origin
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// // Use the cors middleware with these options
// app.use(cors(corsOptions));

// // Also handle preflight OPTIONS requests before mounting routes (optional)
// app.options('*', cors(corsOptions));

// // Mount your routes
// const authRoutes = require('./routes/auth');
// const trackingRoutes = require('./routes/tracking');
// app.use('/auth', authRoutes);
// app.use('/', trackingRoutes);

// // Catch-all OPTIONS handler (if a preflight isn't caught above)
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     res.header("Access-Control-Allow-Origin", "https://emailtracker-eta.vercel.app");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(morgan('dev'));

// // Connect to MongoDB
// mongoose.connect(MONGO_URI);
// const db = mongoose.connection;
// db.on('error', (err) => console.error('MongoDB connection error:', err));
// db.once('open', () => console.log('Connected to MongoDB'));

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins for public endpoints
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('Connected to MongoDB'));

// Mount routes
const authRoutes = require('./routes/auth');
const trackingRoutes = require('./routes/tracking');
app.use('/auth', authRoutes); // For /auth/login and /auth/signup
app.use('/', trackingRoutes); // For /track, /analytics, /events

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});