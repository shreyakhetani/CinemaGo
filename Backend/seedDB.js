const mongoose = require('mongoose');
const CinemaHall = require('./models/CinemaHall');
const MovieShow = require('./models/MovieShow');
const dotenv = require('dotenv');

dotenv.config(); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

async function seedDB() {
    try {
        // Clear the database of existing data
        await CinemaHall.deleteMany({});
        await MovieShow.deleteMany({});
        
        // Use the existing movieIds for your 3 movies
        const movieIds = [
            "670e652d7d95484a63b0d063", // first movie
            "670e67387d95484a63b0d064", // second movie
            "670e6a5c7d95484a63b0d065"  // third movie
        ];

        // Create 9 cinema halls
        const halls = [
            { name: "Hall 1", seats: Array(10).fill(Array(10).fill('free')) },
            { name: "Hall 2", seats: Array(6).fill(Array(5).fill('free')) },
            { name: "Hall 3", seats: Array(8).fill(Array(8).fill('free')) },

            { name: "Hall 4", seats: Array(8).fill(Array(8).fill('free')) },
            { name: "Hall 5", seats: Array(6).fill(Array(8).fill('free')) },
            { name: "Hall 6", seats: Array(7).fill(Array(10).fill('free')) },

            { name: "Hall 7", seats: Array(10).fill(Array(8).fill('free')) },
            { name: "Hall 8", seats: Array(8).fill(Array(8).fill('free')) },
            { name: "Hall 9", seats: Array(8).fill(Array(5).fill('free')) }
        ];

        // Insert all cinema halls into the database
        const cinemaHalls = await CinemaHall.insertMany(halls);
        console.log('Cinema Halls saved:', cinemaHalls);

        // Create a sample movie show for each hall and link it to a movieId
        const movieShows = [
            // Joker showtimes (UTC times)
            { movieId: movieIds[0], hallId: cinemaHalls[0]._id, showtime: new Date("2024-10-20T14:00:00Z") },  
            { movieId: movieIds[0], hallId: cinemaHalls[1]._id, showtime: new Date("2024-10-20T16:00:00Z") }, 
            { movieId: movieIds[0], hallId: cinemaHalls[2]._id, showtime: new Date("2024-10-20T18:00:00Z") },  

            // Wild Robot showtimes
            { movieId: movieIds[1], hallId: cinemaHalls[3]._id, showtime: new Date("2024-10-20T15:00:00Z") },  
            { movieId: movieIds[1], hallId: cinemaHalls[4]._id, showtime: new Date("2024-10-20T17:00:00Z") },  
            { movieId: movieIds[1], hallId: cinemaHalls[5]._id, showtime: new Date("2024-10-20T19:00:00Z") },  

            // It Ends with Us showtimes
            { movieId: movieIds[2], hallId: cinemaHalls[6]._id, showtime: new Date("2024-10-20T17:00:00Z") },  
            { movieId: movieIds[2], hallId: cinemaHalls[7]._id, showtime: new Date("2024-10-20T18:00:00Z") },  
            { movieId: movieIds[2], hallId: cinemaHalls[8]._id, showtime: new Date("2024-10-20T19:00:00Z") }  
        ];


        // Insert all movie shows into the database
        await MovieShow.insertMany(movieShows);
        console.log('Movie Shows saved:', movieShows);

        console.log("Database seeded successfully!");
    } catch (err) {
        console.error('Error while seeding the database:', err);
    } finally {
        mongoose.disconnect(); // Disconnect from MongoDB once the script completes
    }
}

seedDB();