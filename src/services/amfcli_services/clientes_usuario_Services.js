const Services = require('../Services.js');
const {amalfisCli} = require('../../models/index.js');


class Clientes_usuario_Services extends Services{
    constructor(){
        super('Clientes_usuarios')
    }

    async pegaClientesUsuarioPorId_Services(id){
        return amalfisCli.Clientes_usuarios.findAll({
            where: {usuario_id: id},
            attributes:['codcli','nome','cnpj','rg','createdAt']
        })
    }

    async pegaCodcliPorId_Services(id){
        const clientes = await amalfisCli.Clientes_usuarios.findAll({
        where:{usuario_id:id},
        attributes:['codcli']
      })
      return clientes

    }

}

module.exports = Clientes_usuario_Services