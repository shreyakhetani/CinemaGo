const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    hallName: { type: String, required: true },
    showtime: { type: Date, required: true },
    duration: { type: String, required: true },
    language: { type: String, required: true },
    seat: { type: String, required: true },
    userEmail: { type: String, required: true },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;