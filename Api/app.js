'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();

// Load Routes
let user_routes = require('./routes/user');
let follow_routes = require('./routes/follow');
let favorite_routes = require('./routes/favorite');
let product_routes = require('./routes/products');

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
