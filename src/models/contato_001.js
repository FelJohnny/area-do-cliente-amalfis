'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contato_001 extends Model {

    static associate(models) {

    }
  }
  contato_001.init({
    id:{
      type:DataTypes.STRING,
      primaryKey: true,
    },
    codcli: DataTypes.STRING,
    nome: DataTypes.STRING,
    numero: DataTypes.STRING,
    email: DataTypes.STRING,
    celular: DataTypes.STRING,
    tipo: DataTypes.STRING,
    tipo_contato: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Contato_001',
    tableName: 'contato_001'
  });
  return contato_001;
};