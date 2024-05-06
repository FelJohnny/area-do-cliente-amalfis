const Services = require('./Services.js')
const model = require('../models/index.js');
class Pedido_001_Services extends Services{
    constructor(){
        super('Pedido_001')
    }

    async pegaPedidosPorCodCliService(codcli){
        const retorno = await model.Pedido_001.findAll({
            attributes:['codcli', 'numero', 'ped_cli', 'codrep', 'dt_emissao', 'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'],
            where: {codcli: codcli},
            include:[{
                as: 'itens_pedido',
                model: model.Pedido3_001,
                attributes:['codigo','tam','cor','qtde','qtde_f'],
            }]
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

module.exports= Pedido_001_Services;