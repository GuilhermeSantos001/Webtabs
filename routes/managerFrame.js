const express = require('express');
const router = express.Router({
  strict: true,
  caseSensitive: true
});
const middlewareAuth = require('../middlewares/auth');
const middlewareAPI = require('../middlewares/api');
const getReqProps = require('../modules/getReqProps');
const mongodb = require('../modules/mongodb');

router.get([`/command/all`, `/command/all/:id`], middlewareAPI, middlewareAuth, async (req, res) => {
  let {
    id
  } = getReqProps(req, ['id']);

  if (!id) id = '';

  try {
    mongodb.getCommandManagerFrame(id, result => {
      return res.status(200).send({
        result
      });
    });
  } catch (err) {
    return res.status(400).send({
      error: 'A chamada retorno um erro',
      details: err
    });
  }
});

router.post(['/command/register'], middlewareAPI, middlewareAuth, async (req, res) => {
  let {
    id,
    type,
    value
  } = getReqProps(req, ['id', 'type', 'value']);

  if (!id) id = '';

  if (!type) return res.status(400).send({
    error: 'O comando precisa ter um tipo valido',
    details: value
  })

  if (!value) return res.status(400).send({
    error: 'O comando precisa ter um valor valido',
    details: value
  })

  try {
    mongodb.createCommandManagerFrame(id, type, Buffer.from(JSON.stringify(value), 'utf-8').toString(), result => {
      return res.status(200).send({
        result
      });
    });
  } catch (err) {
    return res.status(400).send({
      error: 'A chamada retorno um erro',
      details: err
    });
  }
});

router.post(['/command/clear', '/command/clear/:id'], middlewareAPI, middlewareAuth, async (req, res) => {
  let {
    id
  } = getReqProps(req, ['id']);

  if (!id) id = '';

  try {
    mongodb.clearCommandsManagerFrame(id, result => {
      return res.status(200).send({
        result
      });
    });
  } catch (err) {
    return res.status(400).send({
      error: 'A chamada retorno um erro',
      details: err
    });
  }
});

module.exports = (app) => app.use('/managerFrame', router);