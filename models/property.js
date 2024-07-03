const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    selectedListingType: String,
    selectedPropertyType: String,
    selectedPropertyCategory: String,
    propertyDetails: String,
    address: String,
    city: String,
    selectedDistrict: String,
    pinCode: String,
    carpetArea: String,
    plotSize: String,
    floorLevel: String,
    pricingType: String,
    price: Number,
    agencyName: String,
    sellerName: String,
    sellerMobile: String,
    sellerEmail: String,
    media: [String],
    selectedPlan: String,
    selectedState: String,
    ownerName: String,
    transactionId: String,
    transactionDate: Date,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
