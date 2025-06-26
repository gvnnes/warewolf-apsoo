// src/routes/time.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/time.controller');
const auth = require('../middleware/auth');

// Todas as rotas de time são protegidas e exigem perfil de 'equipe'
router.use(auth, (req, res, next) => {
  if (req.perfil !== 'equipe') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  next();
});

router.post('/', ctrl.criar);

router.get('/', ctrl.listarPorEquipe);

router.post('/:timeId/atletas', ctrl.adicionarAtleta);

router.delete('/:timeId/atletas/:atletaId', ctrl.removerAtleta);


module.exports = router;