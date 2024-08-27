const {Router} = require('express')
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js')
const Clientes_usuario_Controller = require('../../controllers/amfcli_controllers/clientes_usuario_Controller.js')

const clientes_usuario_controller = new Clientes_usuario_Controller()

const route = Router()


route.get('/api/clientes/usuario/:id',checkTokenLogin, (req,res)=> clientes_usuario_controller.pegaClientesUsuarioPorId_Controller(req,res))

module.exports = route;