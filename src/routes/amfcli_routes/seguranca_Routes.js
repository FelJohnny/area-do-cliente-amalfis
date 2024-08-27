const {Router} = require('express')
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js')
const Seguranca_Controller = require('../../controllers/amfcli_controllers/seguranca_Controller.js')

const seguranca_controller = new Seguranca_Controller();

const route = Router()

route.post('/api/seguranca/acl',checkTokenLogin, (req,res)=> seguranca_controller.cadastrarAcl_Controller(req,res))

module.exports = route