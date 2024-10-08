const {Router} = require('express')
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js')
const Permissao_Controller = require('../../controllers/amfcli_controllers/permissao_Controller.js')

const permissao_controller = new Permissao_Controller()

const route = Router()


route.post('/api/permissoes',checkTokenLogin, (req,res)=> permissao_controller.criaPermissao_Controller(req,res))

route.get('/api/permissoes',checkTokenLogin, (req,res)=> permissao_controller.pegaTodosPermissao_Controller(req,res))

route.get('/api/permissoes/:id',checkTokenLogin,(req,res)=> permissao_controller.pegaPermissaoPorId_Controller(req,res))

route.delete('/api/permissoes/:id',checkTokenLogin, (req,res)=>permissao_controller.deletaPermissaoPorId_Controller(req,res))

module.exports = route;