'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Colecao_001 extends Model {

    static associate(models) {
      Colecao_001.hasMany(models.Pedido_001,{
        foreignKey:'codigo',
        as:'pedidos_colecao'
      })
    }
  }
  Colecao_001.init({
    codigo: {
      type: DataTypes.STRING,
      primaryKey:true,
    },
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Colecao_001',
    tableName: 'colecao_001'
  });
  return Colecao_001;
};