const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/classificacao.controller');

router.get('/', ctrl.listarGeral);

router.get('/:modalidadeId', ctrl.listarPorModalidade);

module.exports = router;