// src/routes/equipe.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/equipe.controller');
const auth = require('../middleware/auth');
const { isEquipe, isComissao } = require('../middleware/permissions');
const upload = require('../config/upload');

router.use(auth);

router.get('/minhas-inscricoes', isEquipe, ctrl.minhasInscricoes);
router.get('/proxima-partida', isEquipe, ctrl.proximaPartida); 
router.get('/', isEquipe, ctrl.obter);
router.post('/', isEquipe, ctrl.criarOuAtualizar);
router.post('/logo', isEquipe, upload.single('logo'), ctrl.uploadLogo);

router.get('/gerenciar/todas', isComissao, ctrl.listarTodas);
router.get('/gerenciar/:id', isComissao, ctrl.obterPorId);
router.put('/gerenciar/:id', isComissao, ctrl.atualizarPorId);
router.delete('/gerenciar/:id', isComissao, ctrl.removerPorId);
router.put('/gerenciar/:id/status', isComissao, ctrl.atualizarStatus);

module.exports = router;