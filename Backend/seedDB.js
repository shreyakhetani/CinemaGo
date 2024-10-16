const mongoose = require('mongoose');
const CinemaHall = require('./models/CinemaHall');
const MovieShow = require('./models/MovieShow');
const dotenv = require('dotenv');

dotenv.config(); // Ensure your .env file has the correct database URI

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

async function seedDB() {
    try {
        // Clear the database of existing data
        await CinemaHall.deleteMany({});
        await MovieShow.deleteMany({});
        
        // Create a sample cinema hall
        const cinemaHall = new CinemaHall({
            name: "Main Auditorium",
            seats: Array(10).fill(Array(10).fill('free')) // Creates a 10x10 grid of free seats
        });
        await cinemaHall.save();
        console.log('CinemaHall saved:', cinemaHall);

        // Create a sample movie show
        const movieShow = new MovieShow({
            movieId: new mongoose.Types.ObjectId(), // Generates a new ObjectId
            hallId: cinemaHall._id,
            showtime: new Date() // Sets today's date as the showtime
        });
        await movieShow.save();
        console.log('MovieShow saved:', movieShow);

        console.log("Database seeded successfully!");
    } catch (err) {
        console.error('Error while seeding the database:', err);
    } finally {
        mongoose.disconnect(); // Disconnect from MongoDB once the script completes
    }
}

seedDB();
