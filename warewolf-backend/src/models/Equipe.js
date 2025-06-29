const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Equipe = db.define('Equipe', {
  nome: DataTypes.STRING,
  sigla: DataTypes.STRING,
  cnpj: DataTypes.STRING,
  instituicao: DataTypes.STRING,
  endereco: DataTypes.STRING, 
  cep: DataTypes.STRING,     
  status: {
    type: DataTypes.ENUM('ativo', 'desclassificado'),
    defaultValue: 'ativo'
  },
  
  representanteNome: DataTypes.STRING,
  representanteRG: DataTypes.STRING,
  representanteCPF: DataTypes.STRING,
  representanteOrgaoExp: DataTypes.STRING,
  representanteEndereco: DataTypes.STRING,
  representanteCEP: DataTypes.STRING,
  
  logo: DataTypes.STRING,
  historia: DataTypes.TEXT,
});

module.exports = Equipe;