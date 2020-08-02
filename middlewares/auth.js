const { username, password } = require('../configs/auth.json')['login'];
const getReqProps = require('../modules/getReqProps');

module.exports = (req, res, next) => {
    let {
        user,
        pass
    } = getReqProps(req, ['user', 'pass']);

    if (!user || !password)
        return res.status(401).send({ error: 'Username or Password no provided' });

    if (user != username || password != pass) return res.status(401).send({ error: 'Verify your credentials' });

    return next();
};