const express = require('express');
const router = express.Router({
  strict: true,
  caseSensitive: true
});
const getReqProps = require('../modules/getReqProps');

router.get([`/`, `/:id`], async (req, res) => {

  let {
    teste
  } = getReqProps(req, ['teste']);

  try {

    return res.status(200).send({
      success: 'Teste realizado com sucesso!!',
      get: teste
    });

  } catch (err) {
    return res.status(400).send({
      error: 'O teste retorno um erro',
      details: err
    });
  }
});

module.exports = (app) => app.use('/users', router);