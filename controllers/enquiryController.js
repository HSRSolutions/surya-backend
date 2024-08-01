// controllers/enquiryController.js
const Enquiry = require('../models/Enquiry');

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all enquiries (admin only)
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an enquiry (admin only)
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.status(200).json(enquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an enquiry (admin only)
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.status(200).json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
