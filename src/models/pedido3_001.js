'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido3_001 extends Model {

    static associate(models) {
      Pedido3_001.belongsTo(models.Pedido_001,{
        foreignKey:'numero',
        as:'detalhes_pedido'
      })
    }
  }
  Pedido3_001.init({
    numero: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    codigo: DataTypes.STRING,
    tam: DataTypes.STRING,
    cor: DataTypes.STRING,
    caixa: DataTypes.STRING,
    qtde: DataTypes.INTEGER,
    qtde_f: DataTypes.INTEGER,
    deposito: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pedido3_001',
    tableName: 'pedido3_001'
  });
  return Pedido3_001;
};