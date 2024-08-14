const Services = require('../Services.js')
const {sisplan} = require('../../models/index.js')

class Contato_001_Services extends Services{
    constructor(){
        super('Contato_001')
    }

    async pegaContatoPorCodCli_Services(codcli){
        const retorno = await sisplan.Contato_001.findAll({
            attributes:['id','codcli','nome','numero','email','celular','tipo','tipo_contato'],
            where:{codcli: codcli}
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

module.exports=Contato_001_Services
