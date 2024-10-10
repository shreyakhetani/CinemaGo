const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    description: { type: String },
}, { collection: 'cinema' });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
