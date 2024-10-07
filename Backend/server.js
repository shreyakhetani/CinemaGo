const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/Movies');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
    });

// Middleware
app.use(express.json());

// Routes
app.use('/api/movies', movieRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
