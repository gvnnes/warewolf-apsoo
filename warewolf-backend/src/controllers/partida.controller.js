const { Op } = require('sequelize');
// ❗ IMPORTAÇÕES CORRIGIDAS (com letra maiúscula)
const Partida = require('../models/Partida');
const Equipe = require('../models/Equipe');
const Campeonato = require('../models/Campeonato');
const Modalidade = require('../models/Modalidade');
const Time = require('../models/Time');

const getFaseNome = (numParticipantes) => {
    if (numParticipantes <= 2) return 'Final';
    if (numParticipantes <= 4) return 'Semifinal';
    if (numParticipantes <= 8) return 'Quartas de Final';
    if (numParticipantes <= 16) return 'Oitavas de Final';
    return `Rodada de ${numParticipantes}`;
};

exports.criar = async (req, res) => {
  try {
    const { equipe1Id, equipe2Id, fase, campeonatoId, modalidadeId } = req.body;
    if (!campeonatoId || !equipe1Id || !equipe2Id || !fase || !modalidadeId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    const partida = await Partida.create({ equipe1Id, equipe2Id, fase, campeonatoId, modalidadeId });
    res.status(201).json(partida);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const { campeonatoId, modalidadeId } = req.query;
    const whereClause = {};
    if (campeonatoId) whereClause.campeonatoId = campeonatoId;
    if (modalidadeId) whereClause.modalidadeId = modalidadeId;
    const partidas = await Partida.findAll({
      where: whereClause,
      include: [
        { model: Equipe, as: 'equipe1', attributes: ['id', 'nome', 'logo'] },
        { model: Equipe, as: 'equipe2', attributes: ['id', 'nome', 'logo'] },
        { model: Equipe, as: 'vencedor', attributes: ['id', 'nome'] },
        { model: Campeonato, as: 'campeonato', attributes: ['nome'] },
        { model: Modalidade, as: 'modalidade', attributes: ['nome'] }
      ],
      order: [['id', 'ASC']]
    });
    res.json(partidas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualiza o placar e avança o vencedor para a próxima fase
exports.atualizar = async (req, res) => {
  try {
    const partidaAtual = await Partida.findByPk(req.params.id);
    if (!partidaAtual) return res.status(404).json({ error: 'Partida não encontrada' });

    const { placarEquipe1, placarEquipe2 } = req.body;
    const p1 = parseInt(placarEquipe1, 10);
    const p2 = parseInt(placarEquipe2, 10);
    let vencedorId = null;

    if (!isNaN(p1) && !isNaN(p2)) {
        if (p1 > p2) vencedorId = partidaAtual.equipe1Id;
        else if (p2 > p1) vencedorId = partidaAtual.equipe2Id;
    }
    
    await partidaAtual.update({ placarEquipe1: p1, placarEquipe2: p2, vencedorId });

    if (vencedorId) {
        const partidaParaAvancar = await Partida.findOne({
            where: {
                campeonatoId: partidaAtual.campeonatoId,
                modalidadeId: partidaAtual.modalidadeId,
                equipe2Id: null,
                [Op.not]: { equipe1Id: null }
            }
        });

        if (partidaParaAvancar) {
            await partidaParaAvancar.update({ equipe2Id: vencedorId });
        } else {

            const partidaIrma = await Partida.findOne({
                where: {
                    fase: partidaAtual.fase,
                    vencedorId: { [Op.ne]: null },
                    id: { [Op.ne]: partidaAtual.id },
                    campeonatoId: partidaAtual.campeonatoId,
                    modalidadeId: partidaAtual.modalidadeId,
                }
            });

            if (partidaIrma) {
                const faseAtual = partidaAtual.fase;
                const novaFase = faseAtual + ' - Concluída';
                await partidaIrma.update({ fase: novaFase });
                await partidaAtual.update({ fase: novaFase });
                
                const totalPartidasNaFase = await Partida.count({where: {fase: faseAtual, campeonatoId: partidaAtual.campeonatoId, modalidadeId: partidaAtual.modalidadeId}});
                const proximaFaseNome = getFaseNome(totalPartidasNaFase);
                
                await Partida.create({
                    fase: proximaFaseNome,
                    campeonatoId: partidaAtual.campeonatoId,
                    modalidadeId: partidaAtual.modalidadeId,
                    equipe1Id: vencedorId,
                    equipe2Id: partidaIrma.vencedorId,
                });
            }
        }
    }
    res.json(partidaAtual);
  } catch (err) {
    console.error("ERRO AO ATUALIZAR PARTIDA:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.obterPorId = async (req, res) => {
    try {
        const partida = await Partida.findByPk(req.params.id, {
            include: [
                { model: Equipe, as: 'equipe1', attributes: ['id', 'nome', 'logo'] },
                { model: Equipe, as: 'equipe2', attributes: ['id', 'nome', 'logo'] },
                { model: Equipe, as: 'vencedor', attributes: ['id', 'nome'] },
                { model: Campeonato, as: 'campeonato', attributes: ['nome'] },
                { model: Modalidade, as: 'modalidade', attributes: ['nome'] }
            ]
        });
        if (!partida) {
            return res.status(404).json({ error: 'Partida não encontrada.' });
        }
        res.json(partida);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar detalhes da partida.' });
    }
};