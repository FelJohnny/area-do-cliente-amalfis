'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class permissoes extends Model {

    static associate(models) {
      permissoes.belongsToMany(models.Usuario,{
        through: models.usuarios_permissoes,
        as: 'permissoes_do_usuario',
        foreignKey: 'permissao_id'

      })
      permissoes.belongsToMany(models.Role,{
        through: models.roles_permissoes,
        as: 'roles',
        foreignKey: 'permissao_id'
      })
      permissoes.hasMany(models.UserPermissionAccess, {
        foreignKey: 'permissao_id',
        as: 'user_permissions_access'
      });
      
    }
  }
  permissoes.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permissao',
    tableName:'permissoes'
  });
  return permissoes;
};