'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario_Empresa extends Model {
    static associate(models) {

        
    }
  }
  Usuario_Empresa.init({
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    empresa_id: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Usuario_Empresa',
    tableName: 'usuario_empresas'
  });
  return Usuario_Empresa;
};