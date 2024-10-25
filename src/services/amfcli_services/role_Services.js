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
        return await amalfisCli[this.nomeModel].findAll();
    }

    async pegaRolePorId_Services(id){
        return amalfisCli[this.nomeModel].findByPk(id)
    }

    async deletaRolePorId_Services(id){
        return amalfisCli[this.nomeModel].destroy({ where: { id: id } });
    }

    //serviço para pegar permissões associadas a uma role
    async pegaPermissoesPorRole_Services(roleId) {
        const role = await amalfisCli.Role.findByPk(roleId, {
            include: [{
                model: amalfisCli.Permissao, // Modelo de permissões
                as: 'permissoes', // Alias definido na associação
            }]
        });

        if (!role) {
            return null;
        }

        return role.permissoes; // Retorna as permissões associadas à role
    }
}

module.exports = Role_Services