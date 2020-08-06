const express = require('express');
const router = express.Router({
    strict: true,
    caseSensitive: true
});
const middlewareAuth = require('../middlewares/auth');
const middlewareAPI = require('../middlewares/api');
const getReqProps = require('../modules/getReqProps');
const mongodb = require('../modules/mongodb');

router.get([`/all`, `/all/:id`], middlewareAPI, middlewareAuth, async (req, res) => {
    let {
        id
    } = getReqProps(req, ['id']);

    if (!id) id = '';

    try {
        mongodb.getWindow(id, result => {
            return res.status(200).send({ result });
        });
    } catch (err) {
        return res.status(400).send({
            error: 'A chamada retorno um erro',
            details: err
        });
    }
});

router.post(['/register'], middlewareAPI, middlewareAuth, async (req, res) => {
    let {
        props
    } = getReqProps(req, ['props']);

    if (!props) return res.status(401).send({
        error: 'A janela precisa ter propriedades validas',
        details: value
    })

    try {
        mongodb.createWindow(props, result => {
            return res.status(200).send({ result });
        });
    } catch (err) {
        return res.status(400).send({
            error: 'A chamada retorno um erro',
            details: err
        });
    }
});

module.exports = (app) => app.use('/windows', router);