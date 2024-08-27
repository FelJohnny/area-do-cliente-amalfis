const Controller = require('../Controller.js')
const Permissao_Services =  require('../../services/amfcli_services/permissao_Services.js')

const permissao_services = new Permissao_Services();
const camposObrigatorios = ['nome','descricao'];


class Permissao_Controller extends Controller{
    constructor(){
        super(permissao_services,camposObrigatorios)

    }

    async pegaTodosPermissao_Controller(req, res) {
        try {
          const listaDeRegistro = await permissao_services.pegaTodosPermissao_Services();
          return res.status(200).json(listaDeRegistro);
        } catch (e) {
          console.log(e);
          return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema` });
        }
    }

    async criaPermissao_Controller(req,res){
        const isTrue = await this.allowNull(req,res);
        try{
            if(isTrue.status){
                const {nome, descricao} = req.body;
                const permissao = await permissao_services.criaPermissao_Services({nome, descricao});
                if(permissao.error){
                    return res.status(500).json({
                        message:'já existe uma permissao com o nome informado',
                        error:permissao.error,
                    })
                }else{
                    return res.status(200).json({
                        message:'Permissao criada',
                        error: permissao.error,
                        permissao:permissao,
                    });
                }
            }else{
                return res.status(500).json({
                    message: 'Preencha todos os campos necessarios',
                    campos: isTrue.campos,
                    error: true,
                });
            }
        }catch (e) {
            console.log(e);
            return res.status(400).json({ message: `erro ao criar, contate o administrador do sistema` });
          }
    }

    async pegaPermissaoPorId_Controller(req,res){
        const { id } = req.params;        
        try {
            const permissao = await permissao_services.pegaPermissaoPorId_Services(id);
            if(permissao == null){
              return res.status(400).json({message:`não foi possivel encontrar o registro: ${id}`,permissao});
            }else{
              return res.status(200).json(permissao);
            }
          } catch (e){
            console.log(e);
            return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema` });
          }
    }
    
    async deletaPermissaoPorId_Controller(req,res){
        const { id } = req.params;
        try {
            const permissao = await permissao_services.deletaPermissaoPorId_Services(id);
            if(permissao === 0){
                return res.status(400).json({message: `id ${id} não encontrado`,permissao,error:true})
            }else{
                return res.status(200).json({ message: `id ${id} deletado`,permissao,error:false});
            }
        } catch (error) {
            return res.status(500).json({message: `erro ao buscar registro, contate o administrador do sistema`});
        }
    }
}

module.exports=Permissao_Controller