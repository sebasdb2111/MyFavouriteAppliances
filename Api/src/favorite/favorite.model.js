'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FavoriteSchema = Schema({
    userId: String,
    productId: String,
    createdAt: String
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
