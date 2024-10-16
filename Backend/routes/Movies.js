const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CinemaHall = require('../models/CinemaHall');
const MovieShow = require('../models/MovieShow');
const Booking = require('../models/Booking');
const Movies = require('../models/MoviesSchema')

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

// Get all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movies.find();  // Fetch all movies from the Movies collection

        if (movies.length === 0) {
            return res.status(404).send('No movies found');
        }

        res.json(movies);  // Send the movies as a JSON response
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('Server error');
    }
});

// Get a movie by ID
router.get('/movies/:id', async (req, res) => {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid movie ID format');
    }

    try {
        const movie = await Movies.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;