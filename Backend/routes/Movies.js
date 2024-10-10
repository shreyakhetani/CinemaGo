const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CinemaHall = require('../models/CinemaHall');
const MovieShow = require('../models/MovieShow');
const Booking = require('../models/Booking');

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

module.exports = router;
