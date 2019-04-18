const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  artistId: Number, // based on songkick id
  artistName: String,
  onTourUntil: String,
  events: [{}],
});

module.exports = mongoose.model('Artist', artistSchema);
