const mongoose = require('mongoose');

const movieShowSchema = new mongoose.Schema({
    movieId: mongoose.Schema.Types.ObjectId,
    hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'CinemaHall' },
    showtime: Date
}, { collection: 'MovieShow' });  // Explicitly set collection name

module.exports = mongoose.model('MovieShow', movieShowSchema);