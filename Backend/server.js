const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const moviesRoutes = require('./routes/Movies');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced error handling for MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (like images)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api/movies', moviesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

