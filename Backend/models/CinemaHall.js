const mongoose = require('mongoose');

const cinemaHallSchema = new mongoose.Schema({
    name: String,
    seats: [[{ type: String, default: 'free' }]]
}, { collection: 'CinemaHall' });  // Explicitly set collection name

module.exports = mongoose.model('CinemaHall', cinemaHallSchema);