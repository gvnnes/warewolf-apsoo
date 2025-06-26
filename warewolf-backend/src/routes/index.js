const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const equipeRoutes = require('./equipe.routes');
const atletaRoutes = require('./atleta.routes');
const campeonatoRoutes = require('./campeonato.routes');
const partidaRoutes = require('./partida.routes');
const publicRoutes = require('./public.routes');
const modalidadeRoutes = require('./modalidade.routes');
const timeRoutes = require('./time.routes');
const classificacaoRoutes = require('./classificacao.routes');

router.use('/auth', authRoutes);
router.use('/equipes', equipeRoutes);
router.use('/atletas', atletaRoutes);
router.use('/campeonatos', campeonatoRoutes);
router.use('/partidas', partidaRoutes);
router.use('/public', publicRoutes);
router.use('/modalidades', modalidadeRoutes);
router.use('/times', timeRoutes);
router.use('/classificacao', classificacaoRoutes);

module.exports = router;
