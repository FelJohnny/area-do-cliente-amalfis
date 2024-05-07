
const Controller = require('./Controller.js');
const Pedido_001_Services = require('../services/Pedido_001_Services.js');
const model = require('../models/index.js')
const pedido_001_services = new Pedido_001_Services();

class Pedido_001_Controller extends Controller{
    constructor(){
        super(pedido_001_services);
    }

    async pegaPedidosPorCodCli_Controller(req, res) {
      try {
        const { codcli } = req.params;
        //PAGINACAO
        const { page = 1 } = req.query;
        //limite de registros em cada pagina
        const limit = 5;
        var lastPage = 1;
  
        //consultando quantidade de pedidos encontrados por codcli
        const countPedidos = await model.Pedido_001.count({where:{codcli: codcli}})

        //valida contagem
        if(countPedidos !== 0){
          lastPage = Math.ceil(countPedidos  / limit)
          
          //Criando objeto com as informações de paginacao
          var paginacao ={
            //caminho
            path: '/api/pedido/cliente/cliente/pedido/',
            total_Pedidos:countPedidos,
            limit_por_page:limit,
            current_page:page,
            total_Pages:lastPage,
            prev_page_url: page - 1 >= 1 ? page -1: false,
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + 1,
          }
        }else{
          return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
        }
        const infoLimit = (page * limit) - limit

        const pedidos = await pedido_001_services.pegaPedidosPorCodCli_Service(codcli,infoLimit,limit);
        if(pedidos.retorno.length === 0){
          return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
        }else{

          return res.status(200).json({pedidos:pedidos,paginacao});
        }
      } catch (erro){
        return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro: ${erro}` });
      }
    }

    async pegaUmPedidoPorCodCli_Controller(req, res) {
      
      const { codcli, pedido } = req.params;
      try {
        const pedidos = await pedido_001_services.pegaUmPedidoPorCodCli_Service(codcli,pedido);
        if(pedidos.retorno.length === 0){
          return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
        }else{
          return res.status(200).json(pedidos);
        }
      } catch (erro){
        return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro: ${erro}` });
      }
    }
}

module.exports = Pedido_001_Controller