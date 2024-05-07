'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto_001 extends Model {

    static associate(models) {
      Produto_001.belongsTo(models.Ped_iten_001),{
        foreignKey:'codigo',
        as:'detalhes_produto'
      }
    }
  }
  Produto_001.init({
    codigo: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    descricao: DataTypes.STRING,
    descricao2: DataTypes.STRING,
    unidade: DataTypes.STRING,
    estoque: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Produto_001',
    tableName: 'produto_001'
  });
  return Produto_001;
};