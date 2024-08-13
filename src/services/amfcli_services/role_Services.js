const Services = require('../Services.js');
const {amalfisCli} = require('../../models/index.js')
const uuid = require('uuid')

class Role_Services extends Services{
    constructor(){
        super('Role')
    }

    async criaRole_Services(dados){
        const role = await amalfisCli[this.nomeModel].findOne({
            where:{
                nome: dados.nome
            }
        })        

        if(role !== null){
            console.log('já existe uma role com o nome informado');
            return {error:true, role: role};
        }else{
            const newRole = await amalfisCli[this.nomeModel].create({
                id: uuid.v4(),
                nome: dados.nome,
                descricao: dados.descricao,
            })
            return {error:false, role: newRole};

        }
    }

    async pegaTodosRole_Services(){
        return amalfisCli[this.nomeModel].findAll()
    }
}

module.exports = Role_Services