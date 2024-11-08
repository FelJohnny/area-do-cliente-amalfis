'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reg_estado_001 extends Model {

    static associate(models) {
      Reg_estado_001.hasMany(models.Entidade_001,{
        foreignKey:'codigo',
        as:'regiao_entidade',
      })
    }
  }
  Reg_estado_001.init({
    codigo: {
      type: DataTypes.STRING,
      primaryKey:true,
    },
    descricao: DataTypes.STRING,
    obs: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reg_estado_001',
    tableName: 'reg_estado_001',
  });
  return Reg_estado_001;
};