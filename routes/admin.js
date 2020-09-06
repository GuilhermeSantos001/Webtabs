const express = require('express');
const router = express.Router({
  strict: true,
  caseSensitive: true
});
const middlewareAuth = require('../middlewares/auth');
const middlewareAPI = require('../middlewares/api');
const getReqProps = require('../modules/getReqProps');

router.post(['/update'], middlewareAPI, middlewareAuth, async (req, res) => {
  let {
    id,
    user,
    pass,
    updateNow
  } = getReqProps(req, ['id', 'user', 'pass', 'updateNow']);

  if (!id) id = '';

  if (!user) return res.status(400).send({
    error: 'O nome de usuário precisa ter um valor valido',
    details: value
  })

  if (!pass) return res.status(400).send({
    error: 'A senha de usuário precisa ter um valor valido',
    details: value
  })

  if (!updateNow) return res.status(400).send({
    error: 'A data para atualizar os dados de usuário precisa ter valores validos',
    details: value
  })

  try {
    const fs = require('fs'),
      path = require('path'),
      filePath = path.resolve('configs/auth.json');

    let data = await JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data['login']['username'] = updateNow['user'] || 'admin';
    data['login']['password'] = updateNow['pass'] || '123';

    await fs.writeFileSync(filePath, Buffer.from(JSON.stringify(data, null, 2), 'utf8'));

    return res.status(200).send({
      message: `Os dados do usuário foram atualizados`,
      update: data['login']
    });
  } catch (err) {
    return res.status(400).send({
      error: 'A chamada retorno um erro',
      details: err
    });
  }
});

module.exports = (app) => app.use('/admin', router);