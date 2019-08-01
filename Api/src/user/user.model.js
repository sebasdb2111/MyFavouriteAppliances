'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = Schema({
    username: String,
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
});

module.exports = mongoose.model('User', UserSchema);