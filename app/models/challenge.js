var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// user schema 
var ChallengeSchema = new Schema({
  name:        { type: String, required: true    },
  description: { type: String, required: true    },
  startDate:   { type: Date,   default: Date.now },

  usernames:   [ String ],

  unitMeasure: { type: String, required: true },
  entries:     [ { date: String, success: Boolean } ]
});

module.exports = TransactionSchema;