const mongoose = require('mongoose');

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
  subscription: {
    type: {
      plan: {
        type: String,
        enum: ['basic', 'standard', 'premium'], // Example plans
        default: 'basic',
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
    },
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
