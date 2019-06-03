'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let UserSchema = Schema({
    username: String,
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
});

module.exports = mongoose.model('User', UserSchema); 
