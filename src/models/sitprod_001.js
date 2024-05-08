'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sitprod_001 extends Model {

    static associate(models) {
      Sitprod_001.hasMany(models.Pedido_001,{
        foreignKey:'codigo',
        as:'status_pedidos',
      })
    }
  }
  Sitprod_001.init({
    codigo: {
      type: DataTypes.STRING,
      primaryKey:true,
    },
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sitprod_001',
    tableName: 'sitprod_001',
  });
  return Sitprod_001;
};