const
    authConfig = require('../config/auth'),
    jwt = require('jsonwebtoken');

module.exports = function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400 // 1 Day
    });
}