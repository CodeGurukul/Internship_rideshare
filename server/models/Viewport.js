var mongoose= require('mongoose');

//A mongoose Schema
var viewportSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  name: String,
  origin: {city: String, state: String},
  destination: {city: String, state: String},
  price: Array,
  time: Date,
  phone_no: String
});

// Compile Schema into a mongoose Model
var Viewport = mongoose.model('Viewport',viewportSchema);
module.exports = Viewport;