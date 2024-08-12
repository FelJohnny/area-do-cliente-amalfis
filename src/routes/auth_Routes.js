const { Router } = require('express');
const Auth_Controller = require('../controllers/sisplan_controllers/Auth_Controller.js');

const auth_controller = new Auth_Controller();

const route = Router();

route.post('/api/auth/login',(req,res)=>{ auth_controller.LoginUsuario_Controller(req,res)});


module.exports = route;