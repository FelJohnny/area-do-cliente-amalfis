const { Router } = require('express');
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js');
const UsuarioEmpresa_Controller = require('../../controllers/amfcli_controllers/UsuarioEmpresa_Controller.js')

const usuario_empresa_controller = new UsuarioEmpresa_Controller();
const route = Router();

// Rota para buscar todos os usuários de uma empresa por ID
route.get('/api/empresas/:empresaId/usuarios', checkTokenLogin, (req, res) => usuario_empresa_controller.pegaUsuariosPorEmpresaId_Controller(req, res));

// Rota para atualizar um usuário de uma empresa
route.put('/api/empresas/:empresaId/usuarios/:usuarioId', checkTokenLogin, (req, res) => usuario_empresa_controller.atualizaUsuarioEmpresa_Controller(req, res));

// Rota para excluir um usuário de uma empresa
route.delete('/api/empresas/:empresaId/usuarios/:usuarioId', checkTokenLogin, (req, res) => usuario_empresa_controller.deletaUsuarioEmpresa_Controller(req, res));

route.post('/api/empresas/:empresaId/usuarios/:usuarioId', checkTokenLogin, (req, res) => usuario_empresa_controller.adicionaUsuarioEmpresa_Controller(req, res));

route.get('/api/usuarios/disponiveis', checkTokenLogin, (req, res) => usuario_empresa_controller.pegaUsuariosDisponiveis_Controller(req, res));

module.exports = route;
