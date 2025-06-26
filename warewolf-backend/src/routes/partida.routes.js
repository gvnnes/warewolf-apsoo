const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/partida.controller');
const auth = require('../middleware/auth');

const isComissao = (req, res, next) => {
    if (req.perfil !== 'comissao') {
      return res.status(403).json({ error: 'Acesso negado. Apenas para comissão.' });
    }
    next();
};

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obterPorId);

router.post('/', auth, isComissao, ctrl.criar);

router.put('/:id', auth, isComissao, ctrl.atualizar);


module.exports = router;