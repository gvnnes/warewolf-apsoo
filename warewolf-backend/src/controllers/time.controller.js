
const Time = require('../models/Time');
const Equipe = require('../models/Equipe');
const Atleta = require('../models/Atleta');
const Modalidade = require('../models/Modalidade');

exports.criar = async (req, res) => {
  try {
    const equipe = await Equipe.findOne({ where: { userId: req.userId } });
    if (!equipe) {
      return res.status(403).json({ error: 'Nenhuma equipe encontrada para este usuário.' });
    }

    const { nome, campeonatoId, modalidadeId } = req.body;
    if (!nome || !campeonatoId || !modalidadeId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const time = await Time.create({
      nome,
      campeonatoId,
      modalidadeId,
      equipeId: equipe.id
    });

    res.status(201).json(time);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarPorEquipe = async (req, res) => {
  try {
    const equipe = await Equipe.findOne({ where: { userId: req.userId } });
    if (!equipe) {
      return res.status(403).json({ error: 'Nenhuma equipe encontrada para este usuário.' });
    }

    const times = await Time.findAll({
      where: { equipeId: equipe.id },
      include: [
        { model: Atleta, attributes: ['id', 'nome'], through: { attributes: [] } },
        { model: Modalidade, attributes: ['nome', 'minAtletas', 'maxAtletas']}
      ],
      order: [['id', 'ASC']]
    });

    res.json(times);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adicionarAtleta = async (req, res) => {
    try {
        const { timeId } = req.params;
        const { atletaId } = req.body;

        const equipe = await Equipe.findOne({ where: { userId: req.userId } });
        if (!equipe) return res.status(403).json({ error: 'Equipe não encontrada.' });

        const time = await Time.findByPk(timeId);
        if (!time || time.equipeId !== equipe.id) {
            return res.status(403).json({ error: 'Time inválido ou não pertence à sua equipe.' });
        }

        const atleta = await Atleta.findByPk(atletaId);
        if (!atleta || atleta.equipeId !== equipe.id) {
            return res.status(403).json({ error: 'Atleta inválido ou não pertence à sua equipe.' });
        }
        
        await time.addAtleta(atleta);

        res.status(200).json({ message: 'Atleta adicionado ao time com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removerAtleta = async (req, res) => {
    try {
        const { timeId, atletaId } = req.params;

        const equipe = await Equipe.findOne({ where: { userId: req.userId } });
        if (!equipe) return res.status(403).json({ error: 'Equipe não encontrada.' });

        const time = await Time.findByPk(timeId);
        if (!time || time.equipeId !== equipe.id) {
            return res.status(403).json({ error: 'Time inválido ou não pertence à sua equipe.' });
        }
        
        const atleta = await Atleta.findByPk(atletaId);
        if (!atleta) {
            return res.status(404).json({ error: 'Atleta não encontrado.' });
        }

        await time.removeAtleta(atleta);
        
        res.status(200).json({ message: 'Atleta removido do time com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};