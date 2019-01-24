'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let FollowSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'user'},
    follow: {type: Schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('Follow', FollowSchema);
