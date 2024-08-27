const {Router} = require('express')
const Entidade_001_Controller = require('../../controllers/sisplan_controllers/Entidade_001_Controller.js')
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js')

const entidade_001_controller = new Entidade_001_Controller()

const route = Router();

route.get('/api/entidade/:codcli/',checkTokenLogin,(req,res)=>entidade_001_controller.pegaEntidadePorCodCli_Controller(req,res))
route.get('/api/entidade/nome/:nome/',checkTokenLogin,(req,res)=>entidade_001_controller.pegaEntidadePorNome_Controller(req,res))
route.get('/api/entidade/grupo/:grupo/',checkTokenLogin,(req,res)=>entidade_001_controller.pegaEntidadePorGrupocli_Controller(req,res))

module.exports=route;