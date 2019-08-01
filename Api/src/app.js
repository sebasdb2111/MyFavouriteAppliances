'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Load Routes
const user_routes = require('./user/user.routes');
const follow_routes = require('./follow/follow.routes');
const favorite_routes = require('./favorite/favorite.routes');
const product_routes = require('./product/products.routes');

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Routes
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', favorite_routes);
app.use('/api', product_routes);

// Exports
module.exports = app;
