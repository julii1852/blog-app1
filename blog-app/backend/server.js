const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogapp';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  console.log('Connected to MongoDB');
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, ()=> console.log('Server running on', PORT));
})
.catch(err=> {
  console.error('MongoDB connection error', err);
});
