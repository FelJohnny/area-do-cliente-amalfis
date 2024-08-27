const Services = require('../Services.js')
const {sisplan} = require('../../models')
class Grupo_Cli_001_Services extends Services{
    constructor(){
        super('Grupo_cli_001')
    }

    async pegaTodosGrupoCli_Services(){
        const retorno = await sisplan.Grupo_cli_001.findAll({
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


module.exports=Grupo_Cli_001_Services;