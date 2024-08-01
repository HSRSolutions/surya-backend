const Property = require('../models/property');

// Create a new property
exports.createProperty = async (req, res) => {
    try {
        const property = new Property(req.body);
        await property.save();
        res.status(201).json(property);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

// Get all properties
exports.getProperties = async (req, res) => {
    try {
      // Fetch and sort properties by 'createdAt' in descending order
      const properties = await Property.find().sort({ createdAt: -1 });
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a property by ID
exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a property by ID
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
