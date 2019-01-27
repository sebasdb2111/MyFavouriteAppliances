'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ProductSchema = Schema({
    category: String,
    title: String,
    price: Number,
    image: String,
    updatedAt: String
});

module.exports = mongoose.model('Product', ProductSchema);
