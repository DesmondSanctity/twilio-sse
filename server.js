require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pollRoutes = require('./routes/pollRoutes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
 .connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 })
 .then(() => console.log('MongoDB connected'))
 .catch((err) => console.log('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/polls', pollRoutes);

// Serve Static Files
app.use(express.static('public'));

// Start Server
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
