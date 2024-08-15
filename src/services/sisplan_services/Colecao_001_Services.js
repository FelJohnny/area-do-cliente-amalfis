const Services = require('../Services.js')
const {sisplan} = require('../../models/index.js')

class Colecao_001_Services extends Services{
    constructor(){
        super('Colecao_001')
    }

    async pegaTodosColecao_Services(){
        const retorno = await sisplan.Colecao_001.findAll({
            attributes:['codigo','descricao'],
        })
        if(retorno.length === 0){
            console.log('registro não encontrado na base de dados');
            return { error:true, retorno: retorno };
        }else{
            //dado
            console.log('registro foi encontrado na base de dados');
            return { retorno: retorno,error:false };

        }
    }
}


module.exports=Colecao_001_Services;