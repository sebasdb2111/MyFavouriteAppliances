'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'secret_key';

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'The request has not got authentication headers'});
    }
    const token = req.headers.authorization.replace(/['"]+/g, '');
    let payload = '';
    try {
        payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'Token has expired'
            });
        }
    } catch (ex) {
        return res.status(404).send({
            message: 'Token is not valid'
        });
    }
    req.user = payload;
    next();
}
