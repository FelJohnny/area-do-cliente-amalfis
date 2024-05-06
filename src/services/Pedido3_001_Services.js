const Services = require('./Services.js')
const model = require('../models/index.js')
class Pedido3_001_Services extends Services{
    constructor(){
        super('Pedido3_001')
    }

    async pegaItensPorPedidoService(numero){
        const retorno = await model.Pedido3_001.findAll({
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