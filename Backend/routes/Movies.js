const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CinemaHall = require('../models/CinemaHall');
const MovieShow = require('../models/MovieShow');
const Booking = require('../models/Booking');
const Movies = require('../models/MoviesSchema')
const { validateMovieId } = require('../middleware/validation');


// Get available seats for a showtime
router.get('/showtimes/:id/seats', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const show = await MovieShow.findById(req.params.id).populate('hallId');
        if (!show) {
            return res.status(404).send('Show not found');
        }
        res.json(show.hallId.seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).send('Server error');
    }
});

// Book seats
router.post('/book-seats', async (req, res) => {
    console.log('POST /book-seats route hit');
    const { showId, seats, userId } = req.body;

    // If no userId is provided, assign a default test ID
    const testUserId = userId || new mongoose.Types.ObjectId(); // Generates a new ObjectId as a dummy userId for testing

    if (!mongoose.Types.ObjectId.isValid(showId)) {
        return res.status(400).send('Invalid show ID format');
    }

    try {
        const show = await MovieShow.findById(showId).populate('hallId');
        if (!show) {
            return res.status(404).send('Show not found');
        }

        const booking = new Booking({ showId, seats, userId: testUserId });
        await booking.save();

        // Update seats as booked
        seats.forEach(seat => {
            if (show.hallId.seats[seat.row][seat.col] === 'free') {
                show.hallId.seats[seat.row][seat.col] = 'booked';
            } else {
                throw new Error('Seat is already booked');
            }
        });
        await show.hallId.save();

        res.status(201).send('Booking successful');
    } catch (error) {
        console.error('Error booking seats:', error);
        if (error.message === 'Seat is already booked') {
            res.status(409).send('Some seats are already booked');
        } else {
            res.status(500).send('Server error');
        }
    }
});

// Get all movies with pagination
router.get('/movies', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
    
        const [movies, total] = await Promise.all([
            Movies.find()
            .skip(skip)
            .limit(limit)
            .select('-__v')
            .lean(),
            Movies.countDocuments()
        ]);
    
        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found' });
        }
    
        res.json({
            movies,
            pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMovies: total
            }
        });
        } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
        }
    });
    
    // Get movie by ID with validation middleware
    router.get('/movies/:id', validateMovieId, async (req, res) => {
        try {
        const movie = await Movies.findById(req.params.id).select('-__v').lean();
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
    
        res.json(movie);
        } catch (error) {
        console.error('Error fetching movie by ID:', error);
        res.status(500).json({ error: 'Failed to fetch movie' });
        }
    });
    
    // Search movies
    router.get('/movies/search', async (req, res) => {
        try {
        const { query, genre, language } = req.query;
        const searchQuery = {};
    
        if (query) {
            searchQuery.$or = [
            { name: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') }
            ];
        }
    
        if (genre) {
            searchQuery.genre = new RegExp(genre, 'i');
        }
    
        if (language) {
            searchQuery.language = new RegExp(language, 'i');
        }
    
        const movies = await Movies.find(searchQuery).select('-__v').lean();
        res.json(movies);
        } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search movies' });
        }
    });

    // Get showtimes for a specific movie
    router.get('/movies/:id/showtimes', validateMovieId, async (req, res) => {
        try {
        const movie = await Movies.findById(req.params.id).select('name time').lean();
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Assuming 'time' is the field that stores showtimes
        const showtimes = movie.time || [];

        res.json({ movieId: movie._id, movieName: movie.name, showtimes });
        } catch (error) {
        console.error('Error fetching movie showtimes:', error);
        res.status(500).json({ error: 'Failed to fetch movie showtimes' });
        }
    });

module.exports = router;
