// Importing required modules
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';  // Assuming you have a User model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import Post from './models/Post.js';  // Assuming you have a Post model
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const secret = process.env.SECRET;
const port = process.env.PORT || 8000;

const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use __dirname for static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Connection failed:', error);
  });

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({
      username,
      password: bcrypt.hashSync(password, 10),
    });
    res.json(newUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  
  if (!userDoc) {
    return res.status(400).json('User not found');
  }
  
  const passOk = bcrypt.compareSync(password, userDoc.password);
  
  if (passOk) {
    // User logged in 
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      // Set the token as a cookie
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax', // Ensure compatibility with localhost
      }).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('Wrong credentials');
  }
});

// Profile Route
app.get('/profile', (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No active session' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }
    res.json(info); // Return user info if token is valid
  });
});

// Post Creation Route
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(403).json('Unauthorized');

      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

// Get All Posts Route
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort the posts by creation date in descending order
      .limit(10)               // Limit the number of results to 10
      .populate('author', ['username']); // Populate the 'author' field with 'username'
      
    res.json(posts); // Send the posts as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a Single Post Route
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post
    .findById(id)
    .populate('author', ['username']);
  res.json(postDoc);
});

// Logout Route
app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    postDoc.set({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover, // Update cover only if new one exists
    });

    await postDoc.save();

    res.json(postDoc);
  });

});
// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
