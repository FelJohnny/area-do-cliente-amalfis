const Controller = require('../Controller.js');
const Grupo_Cli_001_Services = require('../../services/sisplan_services/Grupo_Cli_001_Services.js')

const grupo_cli_services = new Grupo_Cli_001_Services()

class Grupo_cli_001_Controller extends Controller{
    constructor(){
        super(grupo_cli_services)
    }

    async pegaTodosGrupoCli_Controller(req, res){
        try {
            const listaGrupos = await grupo_cli_services.pegaTodosGrupoCli_Services();
            if(listaGrupos.retorno.length === 0){
                return res.status(400).json({message:`não foi possivel encontrar a lista de grupos`,error:true});
              }else{
                return res.status(200).json(listaGrupos);
              }
        } catch (e) {
            console.log(e);            
            return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema`,error:true });
        }
    }
}

module.exports = Grupo_cli_001_Controller;

