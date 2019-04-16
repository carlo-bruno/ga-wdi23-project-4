const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  watchlist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Artist'
    }
  ]
});

userSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      email: ret.email,
      watchlist: ret.watchlist
    };
    return returnJson;
  }
});

module.exports = mongoose.model('User', userSchema);
