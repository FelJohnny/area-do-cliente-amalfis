'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ped_iten_001 extends Model {

    static associate(models) {
      Ped_iten_001.belongsTo(models.Pedido_001,{
        foreignKey:'numero',
        as:'pedido'
      }),
      Ped_iten_001.belongsTo(models.Produto_001,{
        foreignKey:'codigo',
        as:'detalhes_produto'
      })
    }
  }
  Ped_iten_001.init({
    codigo: {
      type: DataTypes.STRING,
      primaryKey:true
    },
    numero: DataTypes.STRING,
    cor: DataTypes.STRING,
    tam: DataTypes.STRING,
    qtde: DataTypes.NUMERIC,
    qtde_f: DataTypes.NUMERIC,
    preco: DataTypes.NUMERIC
  }, {
    sequelize,
    modelName: 'Ped_iten_001',
    tableName: 'ped_iten_001'
  });
  return Ped_iten_001;
};