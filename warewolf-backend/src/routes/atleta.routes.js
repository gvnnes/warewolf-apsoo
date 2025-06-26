
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/atleta.controller');
const auth = require('../middleware/auth');
const upload = require('../config/upload');
const { isEquipe, isComissao } = require('../middleware/permissions');

router.use(auth);

router.get('/documentos/pendentes', isComissao, ctrl.listarPendentes);
router.put('/:id/documento/status', isComissao, ctrl.gerenciarDocumento);

router.get('/', isEquipe, ctrl.listar);
router.post('/', isEquipe, ctrl.criar);
router.post('/:id/documento', isEquipe, upload.single('documento'), ctrl.uploadDocumento);
router.put('/:id', isEquipe, ctrl.editar);
router.delete('/:id', isEquipe, ctrl.remover);

module.exports = router;