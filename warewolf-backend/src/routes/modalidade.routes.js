const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/modalidade.controller');
const auth = require('../middleware/auth');
const { isComissao } = require('../middleware/permissions');

router.get('/', auth, ctrl.listar);

router.post('/', auth, isComissao, ctrl.criar);
router.get('/:id', auth, isComissao, ctrl.obterPorId);
router.put('/:id', auth, isComissao, ctrl.atualizar);
router.delete('/:id', auth, isComissao, ctrl.remover);

module.exports = router;