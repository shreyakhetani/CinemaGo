const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const moviesRoutes = require('./routes/Movies');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/ticket');
const emailRoutes = require('./routes/email');

// Add debug logging
const debug = (message, data) => {
    console.log(`[DEBUG] ${message}`, data || '');
};

dotenv.config();
debug('Environment variables loaded');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    debug('Root route accessed');
    res.send('Hello from App Engine!');
});

// MongoDB Connection with detailed logging
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        debug('MongoDB Connection Status:', mongoose.connection.readyState);
        debug('Connected to MongoDB Atlas');
        debug('Database name:', mongoose.connection.name);
    })
    .catch(err => {
        debug('MongoDB connection failed:', {
            error: err.message,
            code: err.code,
            stack: err.stack
        });
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Connection event handlers
mongoose.connection.on('error', (err) => {
    debug('MongoDB error occurred:', err);
});

mongoose.connection.on('disconnected', () => {
    debug('MongoDB disconnected');
});

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    debug('Incoming request:', {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.method === 'POST' ? req.body : undefined
    });
    next();
});

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes with logging
app.use('/api/movies', (req, res, next) => {
    debug('Movies route accessed:', req.path);
    next();
}, moviesRoutes);

app.use('/api/auth', (req, res, next) => {
    debug('Auth route accessed:', req.path);
    next();
}, authRoutes);

app.use('/api/tickets', (req, res, next) => {
    debug('Tickets route accessed:', req.path);
    next();
}, ticketRoutes);

app.use('/api/email', (req, res, next) => {
    debug('Email route accessed:', req.path);
    next();
}, emailRoutes);

// Error handling middleware (enhanced with logging)
app.use((err, req, res, next) => {
    debug('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path
    });
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
app.listen(PORT, () => {
    debug('Server starting with config:', {
        port: PORT,
        env: process.env.NODE_ENV,
        mongoConnected: mongoose.connection.readyState === 1,
        hasMongoUri: !!process.env.MONGO_URI
    });
    console.log(`Server is running on port ${PORT}`);
});