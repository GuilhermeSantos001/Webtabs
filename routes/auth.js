const express = require('express');
const router = express.Router({
  strict: true,
  caseSensitive: true
});
const middlewareAuth = require('../middlewares/auth');
const configAuth = require('../configs/auth.json');
const getReqProps = require('../modules/getReqProps');
const jwt = require('../modules/jwt');

router.get(`/sign`, async (req, res) => {
  let {
    username,
    password
  } = getReqProps(req, ['username', 'password']);

  if (
    !username || !password ||
    username != configAuth.login.username ||
    password != configAuth.login.password
  ) {
    return res.status(401).send({
      error: 'Usuario e/ou Senha invalida.',
      details: {
        username,
        password
      }
    });
  }

  try {
    return res.status(200).send({
      success: 'Teste realizado com sucesso!!',
      get: {
        webtoken: jwt({
          username
        })
      }
    });
  } catch (err) {
    return res.status(400).send({
      error: 'O teste retorno um erro',
      details: err
    });
  }
});

module.exports = (app) => app.use('/auth', router);