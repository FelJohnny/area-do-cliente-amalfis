const Grupo_Cli_001_Controller = require('../../controllers/sisplan_controllers/Grupo_cli_001_Controller.js');
const {Router} = require('express')
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js')

const grupo_cli_001_controller = new Grupo_Cli_001_Controller();

const route = Router();

route.get('/api/grupocli/',checkTokenLogin,(req,res)=>grupo_cli_001_controller.pegaTodosGrupoCli_Controller(req,res))

module.exports=route;