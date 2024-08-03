const PropertyEnquiry = require('../models/propertyEnquiry');
const User = require('../models/user.js');
const Property = require('../models/property');


exports.getUserEnquiries = async (req, res) => {
  // console.log("I have been called");
  try {
    const userId = req.user.id;
    const enquiries = await PropertyEnquiry.find({ userId });

    if (enquiries.length === 0) {
      return res.status(404).json({ message: 'No enquiries found for the user' });
    }

    res.status(200).json({ enquiries });
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
        // console.log(error)
      res.status(400).json({ error: error.message });
    }
  };


  exports.receievEnquiry = async (req, res) => {
    try {
      const ownerId = req.user.id; // Assuming the logged-in user's ID is available as req.user.id
  
      // Find all properties listed by the logged-in user
      const properties = await Property.find({ userId: ownerId });
  
      // Extract property IDs
      const propertyIds = properties.map((property) => property._id);
  
      // Find enquiries for the properties owned by the user
      const enquiries = await PropertyEnquiry.find({
        propertyId: { $in: propertyIds },
      });
  
      // Return only the PropertyEnquiry data, without populating user or property details
      res.status(200).json({ enquiries });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  