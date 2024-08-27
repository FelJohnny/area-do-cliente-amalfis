const Services = require('../Services.js')
const {sisplan, sequelizeSisplan} = require('../../models/index.js')
const {Op} = require('sequelize')

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

    async pegaTodosColecaoPorId_Services(codigo){
        const retorno = await sisplan.Colecao_001.findAll({
            attributes:['codigo','descricao'],
            where:{ 
                codigo: {[Op.like]: `%${codigo}%` 
            }
        }
        
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

    async pegaTodosColecaoPorDescricao_Services(desc){
        const retorno = await sisplan.Colecao_001.findAll({
            attributes:['codigo','descricao'],
            where:{ 
                [Op.and]: [
                    sequelizeSisplan.where(
                        sequelizeSisplan.fn('LOWER', sequelizeSisplan.col('Colecao_001.descricao')),
                        {
                            [Op.like]: `%${desc.toLowerCase()}%`
                        }
                    )
                ]
            }
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