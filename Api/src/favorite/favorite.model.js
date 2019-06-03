'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let FavoriteSchema = Schema({
    userId: String,
    productId: String,
    createdAt: String
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
