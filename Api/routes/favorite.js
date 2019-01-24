'use strict';

let express = require('express');
let FavoriteController = require('../controllers/favorite');
let api = express.Router();
let md_auth = require('../middlewares/authenticated');

api.post('/favorite', md_auth.ensureAuth, FavoriteController.saveFavorite);
api.get('/favorites/:page?', md_auth.ensureAuth, FavoriteController.getFavorites);
api.delete('/favorite/:id', md_auth.ensureAuth, FavoriteController.deleteFavorite);

module.exports = api; 
