const express = require('express');
const router = express.Router();
const Equipe = require('../models/Equipe');
const Atleta = require('../models/Atleta');
const Partida = require('../models/Partida');
const { sequelize } = require('../config/db'); 
const { Op } = require('sequelize');

router.get('/equipes', async (req, res) => {
  try {
    const equipes = await Equipe.findAll({
      attributes: ['id', 'nome', 'sigla', 'logo', 'instituicao', 'representanteNome', 'historia'],
      where: { status: 'ativo' }
    });
    res.json(equipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/equipes/:id/atletas', async (req, res) => {
  try {
    const atletas = await Atleta.findAll({
      where: { equipeId: req.params.id },
      attributes: ['id', 'nome', 'curso', 'situacao'], 
    });
    res.json(atletas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/atleta/:id', async (req, res) => {
    try {
        const atleta = await Atleta.findByPk(req.params.id, {
            attributes: ['id', 'nome', 'curso', 'situacao'] 
        });
        if (!atleta) {
            return res.status(404).json({ error: 'Atleta não encontrado' });
        }
        res.json(atleta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/classificacao', async (req, res) => {
    try {
        const vitorias = await Partida.findAll({
            where: { vencedorId: { [Op.ne]: null } },
            attributes: [
                'vencedorId',
                [sequelize.fn('COUNT', sequelize.col('vencedorId')), 'totalVitorias'],
            ],
            group: ['vencedorId'],
        });

        if (vitorias.length === 0) {
            return res.json([]);
        }

        const equipeIds = vitorias.map(v => v.vencedorId);

        const equipes = await Equipe.findAll({
            where: { id: equipeIds },
            attributes: ['id', 'nome', 'sigla', 'logo']
        });

        const mapaEquipes = equipes.reduce((map, equipe) => {
            map[equipe.id] = { nome: equipe.nome, sigla: equipe.sigla, logo: equipe.logo };
            return map;
        }, {});

        const ranking = vitorias.map(item => ({
            id: item.vencedorId,
            nome: mapaEquipes[item.vencedorId].nome,
            sigla: mapaEquipes[item.vencedorId].sigla,
            logo: mapaEquipes[item.vencedorId].logo,
            vitorias: parseInt(item.dataValues.totalVitorias, 10),
            pontos: parseInt(item.dataValues.totalVitorias, 10) * 3, 
        }));

        ranking.sort((a, b) => b.pontos - a.pontos);

        res.json(ranking);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao calcular classificação: ' + err.message });
    }
});


module.exports = router;