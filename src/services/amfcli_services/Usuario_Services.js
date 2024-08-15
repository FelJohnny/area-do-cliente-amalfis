const Services = require('../Services.js');
const {amalfisCli} = require('../../models/index.js')
const uuid = require('uuid')

class Usuario_Services extends Services{

    async pegaUsuarioPorEmail(email){
        const retorno = await amalfisCli.Usuario.findOne({where: {email: email}})
        if(retorno === null){
            console.log('email não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }else{
            console.log('email foi encontrado na base de dados');
            return {status:true, retorno: retorno};
        }

    }

    async cadastraUsuario_Services(bodyReq){
        const usuario = await amalfisCli.Usuario.create({ id: uuid.v4(), ...bodyReq });

        if(usuario === null){
            console.log('usuario nao cadastrado');
            return {status:false};
        }else{
            try {
                // Adiciona roles, permissoes e colecoes ao usuario
                await usuario.addUsuario_roles(bodyReq.roles);
                await usuario.addUsuario_permissoes(bodyReq.permissoes);
                await usuario.addUsuario_colecoes(bodyReq.colecao);
                console.log('usuario cadastrado');
                return {status:true};
            } catch (e) {
                console.error('Erro na associação', e);
                throw new Error({ message: 'erro na associação' });

            }
        }
    }
}

module.exports = Usuario_Services