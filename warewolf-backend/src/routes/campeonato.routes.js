const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/campeonato.controller');
const auth = require('../middleware/auth');
const { isEquipe, isComissao } = require('../middleware/permissions');

router.use(auth);

router.post('/', isComissao, ctrl.criar);
router.put('/:id', isComissao, ctrl.atualizar);
router.delete('/:id', isComissao, ctrl.remover);
router.post('/:campeonatoId/modalidades/:modalidadeId/gerar-chaveamento', isComissao, ctrl.gerarChaveamento);
router.post('/:campeonatoId/modalidades/:modalidadeId/agendar', isComissao, ctrl.agendarPartidas);
router.get('/:campeonatoId/modalidades/:modalidadeId/times', isComissao, ctrl.listarTimesInscritos);

router.post('/:campeonatoId/modalidades/:modalidadeId/inscrever', isEquipe, ctrl.inscrever);

router.get('/', ctrl.listar);

module.exports = router;