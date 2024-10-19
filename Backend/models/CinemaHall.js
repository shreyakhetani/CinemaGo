const mongoose = require('mongoose');

const cinemaHallSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Hall name
    seats: [[{ type: String, default: 'free' }]],  // 2D array for seats
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }  // Reference to the Movies collection
}, { collection: 'CinemaHall' });

module.exports = mongoose.model('CinemaHall', cinemaHallSchema);