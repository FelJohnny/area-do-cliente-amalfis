const { Router } = require('express');
const Pedido_001_Controller = require('../controllers/Pedido_001_Contrroler.js')
const checkTokenLogin = require('../../middlewares/checkTokenLogin.js')

const pedido_001_controller = new Pedido_001_Controller()

const route = Router();

route.get('/api/pedido/cliente/:codcli/',checkTokenLogin,(req, res)=>{pedido_001_controller.pegaPedidosPorCodCli_Controller(req,res)} )
route.get('/api/pedido/cliente/:codcli/:pedido/',checkTokenLogin,(req, res)=>{pedido_001_controller.pegaUmPedidoPorCodCli_Controller(req,res)} )
route.post('/api/pedido/envio-email/:codcli/:pedido',checkTokenLogin,(req, res)=>{pedido_001_controller.enviaPedidoEmail_Controller(req,res)} )

module.exports = route;