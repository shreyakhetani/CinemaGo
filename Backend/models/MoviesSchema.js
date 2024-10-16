const mongoose =require('mongoose');

const moviesSchema = new mongoose.Schema({
  name: { type: String},
  premiere: { type: Date },  
  distributor: { type: String},
  roles: { type: [String] },  
  halls: { type: String},
  time: { type: [String]},  
  language: { type: String },
  cc: { type: String},
  age: { type: Number},
  imageName: { type: String},
  duration: { type: String },
  director: { type: String },
  genre: { type: String },
  description: { type: String },
  description1: { type: String },
}, { collection: 'Movies' }); 
module.exports = mongoose.model('Movies',moviesSchema);