'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();

// Load Routes
let user_routes = require('./user/user.routes');
let follow_routes = require('./follow/follow.routes');
let favorite_routes = require('./favorite/favorite.routes');
let product_routes = require('./product/products.routes');

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
