const Partida = require('../models/Partida');
const Equipe = require('../models/Equipe');
const sequelize = require('../config/db');
const { Op } = require('sequelize'); // Importe o Op

const calcularClassificacao = async (filtroPartida = {}) => {
  const contagemVitorias = await Partida.findAll({
    where: { ...filtroPartida, vencedorId: { [Op.ne]: null } },
    attributes: [
      'vencedorId',
      [sequelize.fn('COUNT', sequelize.col('vencedorId')), 'totalVitorias'],
    ],
    group: ['vencedorId'],
  });

  if (contagemVitorias.length === 0) {
    return [];
  }
  
  const equipeIds = contagemVitorias.map(v => v.vencedorId);
  const equipes = await Equipe.findAll({
    where: { id: { [Op.in]: equipeIds } },
    attributes: ['id', 'nome'],
  });
  
  const mapaEquipes = equipes.reduce((map, equipe) => {
    map[equipe.id] = equipe.nome;
    return map;
  }, {});
  const classificacao = contagemVitorias.map(item => ({
    equipeId: item.vencedorId,
    equipeNome: mapaEquipes[item.vencedorId],
    vitorias: parseInt(item.dataValues.totalVitorias, 10),
    pontos: parseInt(item.dataValues.totalVitorias, 10) * 3,
  }));
  classificacao.sort((a, b) => {
    if (b.pontos !== a.pontos) {
      return b.pontos - a.pontos;
    }
    return a.equipeNome.localeCompare(b.equipeNome);
  });
  
  return classificacao.map((item, index) => ({ ...item, posicao: index + 1 }));
};

exports.listarGeral = async (req, res) => {
  try {
    const classificacao = await calcularClassificacao();
    res.json(classificacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar classificação geral: ' + err.message });
  }
};

exports.listarPorModalidade = async (req, res) => {
  try {
    const { modalidadeId } = req.params;
    const classificacao = await calcularClassificacao({ modalidadeId });
    res.json(classificacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar classificação por modalidade: ' + err.message });
  }
};