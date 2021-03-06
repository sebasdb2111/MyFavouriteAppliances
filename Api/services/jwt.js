'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'secret_key';

exports.createToken = (user) => {
    const payload = {
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
