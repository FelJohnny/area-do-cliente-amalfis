
const Controller = require('../Controller.js');
const Pedido3_001_Services = require('../../services/sisplan_services/Pedido3_001_Services.js');

const pedido3_001_services = new Pedido3_001_Services();

class Pedido3_001_Controller extends Controller{
    constructor(){
        super(pedido3_001_services);
    }

    async pegaItensExpedidosPorPedido_Controller(req, res) {
        const { numero } = req.params;
        try {
          const ItensPedido = await pedido3_001_services.pegaItensExpedidosPorPedido_Service(numero);
          if(ItensPedido.retorno.length === 0){
            return res.status(400).json({message:`não foi possivel encontrar o registro: ${numero}`});
          }else{
            return res.status(200).json(ItensPedido);
          }
        } catch (erro){
          return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro: ${erro}` });
        }
      }
}

module.exports = Pedido3_001_Controller