const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Remove the deprecated options
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit the process if the connection fails
    }
};

module.exports = connectDB;
