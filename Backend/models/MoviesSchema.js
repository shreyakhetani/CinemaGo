const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    premiere: { 
        type: Date,
        required: true 
    },
    distributor: { 
        type: String,
        required: true,
        trim: true
    },
    roles: { 
        type: [String],
        required: true
    },
    halls: { 
        type: String,
        required: true
    },
    time: { 
        type: [String],
        required: true
    },
    language: { 
        type: String,
        required: true,
        trim: true
    },
    cc: { 
        type: String,
        required: true
    },
    age: { 
        type: Number,
        required: true,
        min: 0
    },
    imageName: { 
        type: String,
        required: true
    },
    duration: { 
        type: String,
        required: true
    },
    director: { 
        type: String,
        required: true,
        trim: true
    },
    genre: { 
        type: String,
        required: true,
        trim: true
    },
    description: { 
        type: String,
        required: true,
        trim: true
    },
    description1: { 
        type: String,
        trim: true
    }
    }, { 
    collection: 'Movies',
    timestamps: true 
    });

module.exports = mongoose.model('Movies', moviesSchema);