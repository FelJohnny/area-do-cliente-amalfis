
const Controller = require('./Controller.js');
const Pedido_001_Services = require('../services/Pedido_001_Services.js');

const pedido_001_services = new Pedido_001_Services();

class Pedido_001_Controller extends Controller{
    constructor(){
        super(pedido_001_services);
    }

    async pegaPedidosPorCodCliController(req, res) {
        const { codcli } = req.params;
        try {
          const pedidos = await pedido_001_services.pegaPedidosPorCodCliService(codcli);
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