const { Router } = require('express');
const Pedido_001_Controller = require('../controllers/Pedido_001_Contrroler.js')

const pedido_001_controller = new Pedido_001_Controller()

const route = Router();

route.get('/api/pedido/cliente/:codcli',(req, res)=>{pedido_001_controller.pegaPedidosPorCodCliController(req,res)} )

module.exports = route;