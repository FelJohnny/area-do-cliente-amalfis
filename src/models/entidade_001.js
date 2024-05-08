'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entidade_001 extends Model {

    static associate(models) {
      Entidade_001.belongsTo(models.Pedido_001,{
        foreignKey:'codcli',
        as:'pedidos_cli',
      })
    }
  }
  Entidade_001.init({
    codcli: {
      type:DataTypes.STRING,
      primaryKey: true,
    },
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    num_rg: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Entidade_001',
    tableName: 'entidade_001'
  });
  return Entidade_001;
};