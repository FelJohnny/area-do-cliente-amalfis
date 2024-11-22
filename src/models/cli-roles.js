'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {

    static associate(models) {
      roles.belongsToMany(models.Usuario,{
        through: models.usuarios_roles,
        as: 'roles_do_usuario',
        foreignKey:'role_id',
      })

      roles.belongsToMany(models.Permissao,{
        through: models.roles_permissoes,
        as: 'permissoes',
        foreignKey:'role_id',
      })
    }
  }
  roles.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    tableName:'roles'
  });
  return roles;
};