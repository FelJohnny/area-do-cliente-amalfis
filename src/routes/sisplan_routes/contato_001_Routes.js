const {Router} = require('express')
const Contato_001_Controller = require('../../controllers/sisplan_controllers/Contato_001_Controller.js')
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js')

const contato_001_controller = new Contato_001_Controller()

const route = Router();

route.get('/api/contato/:codcli/',checkTokenLogin,(req,res)=>contato_001_controller.pegaContatoPorCodCli_Controller(req,res))

module.exports=route;