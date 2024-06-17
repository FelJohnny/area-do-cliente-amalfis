const { Router } = require('express');
const Pedido_001_Controller = require('../controllers/Pedido_001_Contrroler.js')
const checkTokenLogin = require('../../middlewares/checkTokenLogin.js')

const pedido_001_controller = new Pedido_001_Controller()

const route = Router();

//pega pedidos, produtos do pedido e informacoes da entidade, Com lista em paginação
route.get('/api/pedido/cliente/:codcli/',checkTokenLogin,(req, res)=>{pedido_001_controller.pegaPedidosPorCodCli_Controller(req,res)} )
//pega pedidos por data inicio e fim
route.get('/api/pedido/cliente/:codcli/date/',checkTokenLogin,(req, res)=>{pedido_001_controller.pegaPedidosPorCodCliDatas_Controller(req,res)} )
//pega um pedido, produtos do pedido e informacoes da entidade
route.get('/api/pedido/cliente/:codcli/:pedido/',checkTokenLogin,(req, res)=>{pedido_001_controller.pegaUmPedidoPorCodCli_Controller(req,res)} )
//realiza envio de email com informações pertinentes do pedido para a entidade autenticada
route.post('/api/pedido/envio-email/:codcli/:pedido',checkTokenLogin,(req, res)=>{pedido_001_controller.enviaPedidoEmail_Controller(req,res)} )
//

module.exports = route;