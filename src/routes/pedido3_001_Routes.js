const { Router } = require('express');
const Pedido3_001_Controller = require('../controllers/Pedido3_001_Contrroler.js')
const checkTokenLogin = require('../../middlewares/checkTokenLogin.js')

const pedido3_001_controller = new Pedido3_001_Controller()

const route = Router();

route.get('/api/pedido/:numero',checkTokenLogin,(req, res)=>{pedido3_001_controller.pegaItensExpedidosPorPedido_Controller(req,res)} )

module.exports = route;