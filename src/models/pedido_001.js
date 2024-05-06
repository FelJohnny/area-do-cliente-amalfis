'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido_001 extends Model {

    static associate(models) {
      Pedido_001.hasMany(models.Pedido3_001,{
        foreignKey: 'numero',
        as:'itens_pedido'
      })
    }
  }
  Pedido_001.init({
    numero: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    codcli: DataTypes.STRING,
    ped_cli: DataTypes.STRING,
    codrep: DataTypes.STRING,
    dt_emissao: DataTypes.DATE,
    dt_fatura: DataTypes.DATE,
    dt_saida: DataTypes.DATE,
    entrega: DataTypes.DATE,
    nota: DataTypes.STRING,
    deposito: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pedido_001',
    tableName: 'pedido_001'
  });
  return Pedido_001;
};