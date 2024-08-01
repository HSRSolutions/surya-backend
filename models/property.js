const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const PropertySchema = new Schema({
  // Basic details
  listingType: { type: String, required: true },
  propertyKind: { type: String, required: true },
  propertyType: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  ownerName: { type: String, required: true },

  // Address details
  address: { type: String, required: true },
  locality: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },

  // Property details
  carpetArea: { type: String, required: true },
  price: { type: Number, required: true },

  // Media details
  images: [{ type: String }], // Assuming image URLs or filenames
  video: { type: String }, // Assuming video URL or filename
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the `updatedAt` field
PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the model
const Property = mongoose.model('Property', PropertySchema);
module.exports = Property;
