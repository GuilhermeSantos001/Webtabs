const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const getReqProps = require('../modules/getReqProps');

module.exports = (req, res, next) => {
    const authHeader = getReqProps(req, ['authorization'])['authorization'];

    if (!authHeader)
        return res.status(401).send({
            error: 'No token provided'
        });

    jwt.verify(authHeader, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({
            error: 'Token invalid'
        });

        req.params['username'] = decoded['username'];
        req.params['webtoken'] = decoded['webtoken'];

        return next();
    });
};