const {Router} = require('express')
const checkTokenLogin = require('../../middlewares/checkTokenLogin.js')
const Role_Controller = require('../controllers/amfcli_controllers/role_Controller.js')

const role_controller = new Role_Controller();
const route = Router()


route.post('/api/roles',checkTokenLogin, (req,res)=> role_controller.criaRole_Controller(req,res))

route.get('/api/roles',checkTokenLogin, (req,res)=> role_controller.pegaTodosRole_Controller(req,res))

route.get('/api/roles/:id',checkTokenLogin,)

route.delete('/api/roles/:id',checkTokenLogin, )

route.put('/api/roles/:id',checkTokenLogin, )

module.exports= route