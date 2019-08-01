'use strict';

const express = require('express');
const ProductController = require('./product.controller');
const api = express.Router();

api.get("/small-appliances", ProductController.smallAppliances);
api.get("/dishwashers", ProductController.dishwashers);

module.exports = api;