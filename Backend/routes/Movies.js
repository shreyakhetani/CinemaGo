const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// GET all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new movie
router.post('/', async (req, res) => {
    const movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        releaseDate: req.body.releaseDate,
        duration: req.body.duration,
        description: req.body.description,
    });

    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
