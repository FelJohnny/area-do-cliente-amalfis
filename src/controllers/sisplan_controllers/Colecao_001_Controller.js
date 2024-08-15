const Controller = require('../Controller.js');
const Colecao_001_Services = require('../../services/sisplan_services/Colecao_001_Services.js')

const colecao_001_services = new Colecao_001_Services()

class Grupo_cli_001_Controller extends Controller{
    constructor(){
        super(colecao_001_services)
    }

    async pegaTodosColecao_Controller(req, res){
        try {
            const listaColecao = await colecao_001_services.pegaTodosColecao_Services();
            if(listaColecao.retorno.length === 0){
                return res.status(400).json({message:`não foi possivel encontrar a lista de colecoes`,error:true});
              }else{
                return res.status(200).json(listaColecao);
              }
        } catch (e) {
            console.log(e);            
            return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema`,error:true });
        }
    }
}

module.exports = Grupo_cli_001_Controller;

