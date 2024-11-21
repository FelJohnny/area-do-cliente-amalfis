const { Router } = require('express');
const Pedido_001_Controller = require('../../controllers/sisplan_controllers/Pedido_001_Contrroler.js');
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js');

const pedido_001_controller = new Pedido_001_Controller();

const route = Router();

// Pega pedidos, produtos do pedido e informações da entidade, com lista em paginação
route.get('/api/pedido/cliente/:id/', checkTokenLogin, (req, res) => {pedido_001_controller.pegaPedidosPorCodCliEColecao_Controller(req, res);});

// Pega pedidos por data início e fim
route.get('/api/pedido/cliente/:id/date/', checkTokenLogin, (req, res) => {pedido_001_controller.pegaPedidosPorCodCliColecaoEDatas_Controller(req, res);});

// Pega pedidos com filtros adicionais (região e coleção)
route.post('/api/pedido/cliente/:id/com-filtros', checkTokenLogin, (req, res) => {pedido_001_controller.pegaPedidoComFiltro(req, res);});

// Pega um pedido, produtos do pedido e informações da entidade
route.get('/api/pedido/cliente/:codcli/:pedido/', checkTokenLogin, (req, res) => {pedido_001_controller.pegaUmPedidoPorCodCli_Controller(req, res);});

// Realiza envio de email com informações pertinentes do pedido para a entidade autenticada
route.post('/api/pedido/envio-email/:codcli/:pedido', checkTokenLogin, (req, res) => {pedido_001_controller.enviaPedidoEmail_Controller(req, res);});


module.exports = route;
