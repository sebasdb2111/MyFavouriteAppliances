'use strict';

let mongoose = require('mongoose');
let app = require('./app');
let port = 3800;

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/kultr')
    .then(() => {
        console.log("Database conection Ok");
        // Server creation
        app.listen(port, () => {
            console.log("Server running in http://localhost:3800");
        });
    })
    .catch(err => console.log(err));
