const express = require('express');
const router = express.Router({
  strict: true,
  caseSensitive: true
});

/* GET home page. */
router.get(`/`, async (req, res) => {
  const {
    ip,
    port
  } = require('../configs/server.json');

  res.render('index', {
    title: 'Webtabs',
    serverIP: ip,
    serverPort: port
  });
});

module.exports = (app) => app.use('/', router);