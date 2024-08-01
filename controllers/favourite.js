const Favorite = require('../models/favourite');

exports.addFavorite = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    
    // Check if the property is already in the user's favorites
    const existingFavorite = await Favorite.findOne({ userId, propertyId });

    if (existingFavorite) {
      // If it exists, remove it from favorites
      await Favorite.deleteOne({ userId, propertyId });
      res.status(200).json({ message: 'Property removed from favorites' });
    } else {
      // If it does not exist, add it to favorites
      const newFavorite = new Favorite({ userId, propertyId });
      await newFavorite.save();
      res.status(200).json({ message: 'Property added to favorites', favorite: newFavorite });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId }).populate('propertyId');
    if (favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found' });
    }
    res.status(200).json({ favorites });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
