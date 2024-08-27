const Controller = require('../Controller.js');
const Entidade_001_Services = require('../../services/sisplan_services/Entidade_001_Services.js')

const entidade_001_services = new Entidade_001_Services()
class Entidade_001_Controller extends Controller{
    constructor(){
        super(entidade_001_services)
    }

    async pegaEntidadePorCodCli_Controller(req,res){
      const { codcli } = req.params;
      try{
          const entidades = await entidade_001_services.pegaEntidadePorCodCli_Services(codcli)
          if(entidades.retorno.length === 0){
              return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`,error:true});
            }else{
              return res.status(200).json(entidades);
            }
      }catch(e){
        console.log(e);         
        return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema`,error:true });
      }
  }

  async pegaEntidadePorGrupocli_Controller(req,res){
    const { grupo } = req.params;
    try{
        const entidades = await entidade_001_services.pegaEntidadePorGrupocli_Services(grupo)
        if(entidades.retorno.length === 0){
            return res.status(400).json({message:`não foi possivel encontrar o registro: ${grupo}`,error:true});
          }else{
            return res.status(200).json(entidades);
          }
    }catch(e){
      console.log(e);         
      return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema`,error:true });
    }
  }

  async pegaEntidadePorNome_Controller(req,res){
    const { nome } = req.params;
    try{
        const entidades = await entidade_001_services.pegaEntidadePorNome_Services(nome)
        if(entidades.retorno.length === 0){
            return res.status(400).json({message:`não foi possivel encontrar o registro: ${nome}`,error:true});
          }else{
            return res.status(200).json(entidades);
          }
    }catch(e){
      console.log(e);         
      return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema`,error:true });
    }
  }
}

module.exports=Entidade_001_Controller;