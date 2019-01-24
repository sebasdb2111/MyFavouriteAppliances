'use strict';

let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'secret_key';

exports.createToken = function (user) {
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    return jwt.encode(payload, secret);
};
