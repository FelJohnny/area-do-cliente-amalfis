'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clientes_usuarios extends Model {

    static associate(models) {
      Clientes_usuarios.belongsTo(models.Usuario,{
        foreignKey:'usuario_id',
        as:'clientes_usuario',
      })
    }
  }
  Clientes_usuarios.init({
    usuario_id: DataTypes.UUID,
    codcli: DataTypes.STRING,
    nome: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    rg: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Clientes_usuarios',
    tableName: 'clientes_usuarios'
  });
  return Clientes_usuarios;
};