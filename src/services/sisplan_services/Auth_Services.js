const Services = require('../Services.js');
const db = require('../../models/index.js')

const bcrypt = require('bcrypt');

class Auth_Services extends Services{
    constructor(){
        super('Entidade_001')
    }

    async pegaRegistroPorEmail_Services(email){

        const retorno = await db.sisplan.Entidade_001.findOne({
            where: {email: email},
            attributes:['codcli','nome','email','telefone','cnpj','num_rg']
        })
        if(retorno === null){
            console.log('ERRO: email não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }else{
            console.log('SUCESSO: email foi encontrado na base de dados');
            return {status:true, retorno: retorno};
        }
    }

    async validaSenhaUsuario_Services(email, cnpj){
        const retorno = await db.sisplan.Entidade_001.findAll({
            attributes:['codcli','nome','email','telefone','cnpj','num_rg'],
            where: {email: email}
        });
        if(retorno === null){
            console.log('ERRO: email não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }

        // Verifica se o CNPJ retornado do banco é igual ao CNPJ passado como parâmetro
        let check = false
        let data 
        retorno.forEach(user => {
            if (user.dataValues.cnpj == cnpj) {
                data = user.dataValues;
                check = true;
                
            } else {
                console.log('Senha não confere');
            }
        });
        if(check){
            return {status:true, retorno: data};
        }else{
            return{status: false}
        }
        //return {status:false}

    }
}

module.exports = Auth_Services;