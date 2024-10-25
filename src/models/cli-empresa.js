'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    static associate(models) {
        
      Empresa.belongsToMany(models.Usuario, {
        through: models.Usuario_Empresa,
        as: 'usuarios',
        foreignKey: 'empresa_id'
      });
    }
  }
  Empresa.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    endereco: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresas'
  });
  return Empresa;
};
