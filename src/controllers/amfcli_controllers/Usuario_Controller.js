const Controller = require('../Controller.js')
const Usuario_services = require('../../services/amfcli_services/Usuario_Services.js')

const usuario_services = new Usuario_services();
const camposObrigatorios = ['nome','colecao','email','senha','contato']

class Usuario_Controller extends Controller{
    constructor(){
        super(usuario_services,camposObrigatorios)
    }
}

module.exports = Usuario_Controller;