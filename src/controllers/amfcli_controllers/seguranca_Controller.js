const Controller = require('../Controller.js');
const Seguranca_Services=require('../../services/amfcli_services/seguranca_Services.js');
const seguranca_services = new Seguranca_Services();

class Seguranca_Controller extends Controller{
    constructor(){
        super(seguranca_services)
    }

    async cadastrarAcl_Controller(req,res){
        const {roles, permissoes} = req.body;
    }
}

module.exports=Seguranca_Controller