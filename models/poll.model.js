const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
 question: { type: String, required: true },
 options: [
  {
   name: String,
   votes: { type: Number, default: 0 },
  },
 ],
 participants: { type: [String], default: [] }, // Stores WhatsApp numbers
});

module.exports = mongoose.model('Poll', pollSchema);
