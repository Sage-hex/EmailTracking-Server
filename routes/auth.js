// routes/auth.js

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// // User Schema for traditional auth
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });
// const User = mongoose.model('User', userSchema);

// // Signup endpoint: creates a new user with hashed password
// router.post('/signup', async (req, res) => {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password)
//       return res.status(400).json({ error: 'Missing required fields' });
//     try {
//       console.log('Signup attempt for:', { username, email });
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         console.log('User already exists:', email);
//         return res.status(400).json({ error: 'User already exists' });
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       console.log('Password hashed successfully.');
//       const newUser = new User({ username, email, password: hashedPassword });
//       await newUser.save();
//       console.log('New user saved:', newUser);
//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//       console.error('Signup error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  

// // Login endpoint: verifies credentials and returns a JWT
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ error: 'Missing email or password' });
//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ error: 'Invalid credentials' });
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch)
//       return res.status(401).json({ error: 'Invalid credentials' });
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, username: user.username },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     res.json({ token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;

// routes/auth.js

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// // Traditional User Schema (NO googleId)
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });
// const User = mongoose.model('User', userSchema);

// // Signup endpoint
// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   if (!username || !email || !password) {
//     console.error('Missing required fields:', req.body);
//     return res.status(400).json({ error: 'Missing required fields' });
//   }
//   try {
//     console.log("Attempting signup for:", { username, email });
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       console.log("User already exists:", existingUser);
//       return res.status(400).json({ error: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("Password hashed successfully.");
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();
//     console.log("New user created:", newUser);
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ error: 'Internal server error', details: error.message });
//   }
// });

// // Login endpoint (remains unchanged)
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ error: 'Missing email or password' });
//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ error: 'Invalid credentials' });
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch)
//       return res.status(401).json({ error: 'Invalid credentials' });
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, username: user.username },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     res.json({ token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;








const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Signup Endpoint
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;