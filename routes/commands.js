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
    mongodb.getCommand(id, result => {
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
    id,
    value
  } = getReqProps(req, ['id', 'value']);

  if (!id) id = '';

  if (!value) return res.status(401).send({
    error: 'O comando precisa ter um valor valido',
    details: value
  })

  try {
    mongodb.createCommand(id, value, result => {
      return res.status(200).send({ result });
    });
  } catch (err) {
    return res.status(400).send({
      error: 'A chamada retorno um erro',
      details: err
    });
  }
});

router.post(['/clear', '/clear/:id'], middlewareAPI, middlewareAuth, async (req, res) => {
  let {
    id
  } = getReqProps(req, ['id']);

  if (!id) id = '';

  try {
    mongodb.clearCommands(id, result => {
      return res.status(200).send({ result });
    });
  } catch (err) {
    return res.status(400).send({
      error: 'A chamada retorno um erro',
      details: err
    });
  }
});

module.exports = (app) => app.use('/commands', router);