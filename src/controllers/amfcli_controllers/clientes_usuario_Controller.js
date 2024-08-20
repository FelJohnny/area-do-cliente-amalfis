const Controller = require('../Controller.js')
const Clientes_Usuario_Services =  require('../../services/amfcli_services/clientes_usuario_Services.js')

const clientes_usuario_services = new Clientes_Usuario_Services();


class Clientes_Usuario_Controller extends Controller{
    constructor(){
        super(clientes_usuario_services)

    }

    async pegaClientesUsuarioPorId_Controller(req,res){
        const { id } = req.params;        
        try {
            const clientes = await clientes_usuario_services.pegaClientesUsuarioPorId_Services(id);
            if(clientes == null){
              return res.status(400).json({message:`não foi possivel encontrar clientes neste usuario`});
            }else{
              return res.status(200).json(clientes);
            }
          } catch (e){
            console.log(e);
            return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema` });
          }
    }
    

}

module.exports=Clientes_Usuario_Controller