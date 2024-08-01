const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favourite');

router.post('/', favoritesController.addFavorite);
router.get('/:userId', favoritesController.getFavorites);

module.exports = router;
