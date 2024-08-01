const PropertyEnquiry = require('../models/propertyEnquiry');



exports.getUserEnquiries = async (req, res) => {
  try {
    const { userId } = req.params;
    const enquiries = await Enquiry.find({ userId }).populate('propertyId');
    if (enquiries.length === 0) {
      return res.status(404).json({ message: 'No enquiries found for the user' });
    }

    // Optionally, you can include property details if needed
    const enquiriesWithDetails = await Promise.all(enquiries.map(async enquiry => {
      const property = await PropertyEnquiry.findById(enquiry.propertyId);
      return {
        ...enquiry._doc,
        propertyDetails: property
      };
    }));

    res.status(200).json({ enquiries: enquiriesWithDetails });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.createEnquiry = async (req, res) => {
    try {
      const { propertyId, name, email, mobile, userId } = req.body;
      const newEnquiry = new PropertyEnquiry({ propertyId, name, email, mobile, userId });
      await newEnquiry.save();
      res.status(200).json({ message: 'Enquiry submitted successfully', enquiry: newEnquiry });
    } catch (error) {
        console.log(error)
      res.status(400).json({ error: error.message });
    }
  };