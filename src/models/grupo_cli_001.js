'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grupo_cli_001 extends Model {

    static associate(models) {
      Grupo_cli_001.hasMany(models.Entidade_001,{
        foreignKey:'codigo',
        as:'grupo_cli',
      })
    }
  }
  Grupo_cli_001.init({
    codigo: {
      type: DataTypes.STRING,
      primaryKey:true,
    },
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Grupo_cli_001',
    tableName: 'grupo_cli_001'
  });
  return Grupo_cli_001;
};