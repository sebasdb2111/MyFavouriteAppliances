'use strict';

let express = require('express');
let ProductController = require('../controllers/product');
let api = express.Router();

api.get("/small-appliances", ProductController.smallAppliances);
api.get("/dishwashers", ProductController.dishwashers);

module.exports = api;