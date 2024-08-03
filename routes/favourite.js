const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favourite');

router.post('/add', favoritesController.addFavorite);
router.get('/:userId', favoritesController.getFavorites);

router.post('/remove', favoritesController.removeFavorite);

module.exports = router;
