
exports.isComissao = (req, res, next) => {
  if (req.perfil !== 'comissao') {
    return res.status(403).json({ error: 'Acesso negado. Apenas para comissão.' });
  }
  next();
};

exports.isEquipe = (req, res, next) => {
    if (req.perfil !== 'equipe') {
        return res.status(403).json({ error: 'Acesso negado. Apenas para equipes.' });
    }
    next();
};