
const express = require('express');
const router = express.Router({
  strict: true,
  caseSensitive: true
});

/* GET home page. */
router.get(`/`, async (req, res) => {
    res.render('index', { title: 'Webtabs' });
});

module.exports = (app) => app.use('/', router);