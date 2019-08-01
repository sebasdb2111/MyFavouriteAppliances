'use strict';

const express = require('express');
const FavoriteController = require('./favorite.controller');
const api = express.Router();
const md_auth = require('../../middlewares/authenticated');

api.post('/favorite', md_auth.ensureAuth, FavoriteController.saveFavorite);
api.get('/favorites/:page?', md_auth.ensureAuth, FavoriteController.getFavorites);
api.delete('/favorite/:id', md_auth.ensureAuth, FavoriteController.deleteFavorite);

module.exports = api; 
