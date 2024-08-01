const mongoose = require('mongoose');

const PropertyEnquirySchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PropertyEnquiry', PropertyEnquirySchema);
