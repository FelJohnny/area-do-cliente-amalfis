'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {

    static associate(models) {
      usuarios.belongsToMany(models.Role,{
        through: models.usuarios_roles,
        as: 'usuario_roles',
        foreignKey:'usuario_id',
      })
      usuarios.belongsToMany(models.Permissao,{
        through: models.usuarios_permissoes,
        as: 'usuario_permissoes',
        foreignKey:'usuario_id',
      })
      usuarios.hasMany(models.Clientes_usuarios,{
        foreignKey:'usuario_id',
        as:'usuario_clientes',
      })
      usuarios.hasMany(models.Colecao_usuarios,{
        foreignKey:'usuario_id',
        as:'usuario_colecoes',
      })
    }
  }
  usuarios.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    contato: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName:'usuarios',
    defaultScope: {
      attributes: {
        exclude: ['senha']
      }
    }
  });
  return usuarios;
};