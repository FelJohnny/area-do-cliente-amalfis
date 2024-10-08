const Colecao_001_Controller = require('../../controllers/sisplan_controllers/Colecao_001_Controller.js');
const {Router} = require('express')
const checkTokenLogin = require('../../../middlewares/checkTokenLogin.js')

const colecao_001_controller = new Colecao_001_Controller();

const route = Router();

route.get('/api/colecao/',checkTokenLogin,(req,res)=>colecao_001_controller.pegaTodosColecao_Controller(req,res))
route.get('/api/colecao/:codigo',checkTokenLogin,(req,res)=>colecao_001_controller.pegaTodosColecaoPorId_Controller(req,res))
route.get('/api/colecao/descricao/:desc',checkTokenLogin,(req,res)=>colecao_001_controller.pegaTodosColecaoPorDescricao_Controller(req,res))

module.exports=route;