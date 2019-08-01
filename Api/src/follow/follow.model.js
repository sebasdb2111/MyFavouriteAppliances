'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FollowSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'user'},
    follow: {type: Schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('Follow', FollowSchema);
