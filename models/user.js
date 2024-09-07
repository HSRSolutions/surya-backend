const mongoose = require('mongoose');

// Define subscription schema
const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ['basic', 'standard', 'premium'], // Example plans
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'expired'],
    default: 'inactive',
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  renewalDate: {
    type: Date,
    default: null,
  },
  transactionId: {
    type: String,
    default: null,
  },
  transactionDate: {
    type: Date,
    default: null,
  },
  listingsAllowed: {
    type: Number,
    required: true, // Number of listings allowed for this plan
  },
}); // Disable automatic _id generation for each subscription object

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  subscriptions: {
    type: [subscriptionSchema], // Array of subscription objects
    default: [], // Initialize with an empty array
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
