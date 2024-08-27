'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class colecao_usuarios extends Model {

    static associate(models) {
      colecao_usuarios.belongsTo(models.Usuario,{
        foreignKey:'usuario_id',
        as:'colecoes_usuario',
      })
    }
  }
  colecao_usuarios.init({
    usuario_id: DataTypes.UUID,
    codigo: DataTypes.STRING,
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Colecao_usuarios',
    tableName: 'colecao_usuarios'
  });
  return colecao_usuarios;
};