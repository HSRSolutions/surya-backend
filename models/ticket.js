const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  issue: { type: String, required: true },
  stage: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
}, {timestamps: true});

module.exports = mongoose.model('Ticket', ticketSchema);
