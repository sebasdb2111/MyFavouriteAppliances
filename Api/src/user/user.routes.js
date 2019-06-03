'use strict';

let express = require('express');
let UserController = require('./user.controller');
let api = express.Router();
let md_auth = require('../../middlewares/authenticated');

api.post('/register', UserController.saveUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);

module.exports = api;
