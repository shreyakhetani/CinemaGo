const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware
const moviesRoutes = require('./routes/Movies'); // This should include all movie, cinema hall, and booking routes as per previous setup

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection failed:', err.message));

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());  // Add this line to enable CORS

// Register routes
app.use('/api/movies', moviesRoutes); // All movie-related routes are prefixed with '/api/movies'

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
