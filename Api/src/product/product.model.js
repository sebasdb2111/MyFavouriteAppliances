'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = Schema({
    category: String,
    title: String,
    price: Number,
    image: String,
    updatedAt: String
});

module.exports = mongoose.model('Product', ProductSchema);
