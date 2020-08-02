const code = require('../configs/auth.json')["system-code"];
const getReqProps = require('../modules/getReqProps');

module.exports = (req, res, next) => {
    const authHeader = getReqProps(req, ['system-code'])['system-code'];

    if (!authHeader) return res.status(401).send({ error: 'No System Code provided' });

    if (code != authHeader) return res.status(401).send({ error: 'Verify your System Code' });

    return next();
};