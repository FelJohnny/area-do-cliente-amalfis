const Services = require('./Services.js');
const model = require('../models/index.js');
const bcrypt = require('bcrypt');

class Auth_Services extends Services{
    constructor(){
        super('Entidade_001')
    }

    async pegaRegistroPorEmail_Services(email){

        const retorno = await model.Entidade_001.findOne({
            where: {email: email},
            attributes:['codcli','nome','email','telefone','cnpj','num_rg']
        })
        if(retorno === null){
            console.log('email não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }else{
            console.log('email foi encontrado na base de dados');
            return {status:true, retorno: retorno};
        }
    }

    async validaSenhaUsuario_Services(email, cnpj){
        const retorno = await model.Entidade_001.findOne({
            attributes:['codcli','nome','email','telefone','cnpj','num_rg'],
            where: {email: email}
        });
        if(retorno === null){
            console.log('email não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }

        // Verifica se o CNPJ retornado do banco é igual ao CNPJ passado como parâmetro
        if (retorno.cnpj === cnpj) {
            console.log('Senha Confere');
            return {status:true, retorno: retorno};
        } else {
            console.log('Senha não confere');
            return {status:false}
        }

    }
}

module.exports = Auth_Services;