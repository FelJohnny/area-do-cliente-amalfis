const Services = require('../Services.js')
const db = require('../../models/index.js')
class Pedido3_001_Services extends Services{
    constructor(){
        super('Pedido3_001')
    }

    async pegaItensExpedidosPorPedido_Service(numero){
        const retorno = await db.sisplan.Pedido3_001.findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','caixa', 'qtde', 'qtde_f', 'deposito'],
            where: {numero: numero},
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

module.exports= Pedido3_001_Services;