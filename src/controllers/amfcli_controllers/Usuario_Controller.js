const Controller = require('../Controller.js')
const Usuario_services = require('../../services/amfcli_services/Usuario_Services.js')

const usuario_services = new Usuario_services();

class Usuario_Controller extends Controller{
    constructor(){
        super(usuario_services)
    }
}

module.exports = Usuario_Controller;