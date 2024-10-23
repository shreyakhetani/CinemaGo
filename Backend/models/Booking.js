const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    showId: { type: mongoose.Schema.Types.ObjectId, ref: 'MovieShow' },
    seats: [{ row: Number, col: Number }],
    userId: mongoose.Schema.Types.ObjectId
}, { collection: 'Booking' }); 

module.exports = mongoose.model('Booking', bookingSchema);