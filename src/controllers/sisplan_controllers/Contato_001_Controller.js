const Controller = require('../Controller.js');
const Contato_001_Services = require('../../services/sisplan_services/Contato_001_Services.js')
const {sisplan} = require('../../models/index.js')

const contato_001_services = new Contato_001_Services()
class Contato_001_Controller extends Controller{
    constructor(){
        super(contato_001_services)
    }

    async pegaContatoPorCodCli_Controller(req,res){
        const { codcli } = req.params;
        try{
            const contatos = await contato_001_services.pegaContatoPorCodCli_Services(codcli)
            if(contatos.retorno.length === 0){
                return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`,error:true});
              }else{
                return res.status(200).json(contatos);
              }
        }catch(e){
          return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema`,error:true });
        }
    }
}

module.exports=Contato_001_Controller;