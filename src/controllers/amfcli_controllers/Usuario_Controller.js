const Controller = require('../Controller.js')
const Usuario_services = require('../../services/amfcli_services/Usuario_Services.js')
const usuario_services = new Usuario_services();
const bcrypt = require('bcrypt');
const camposObrigatorios = ['nome','colecao','email','senha','contato','roles_id','permissoes_id',]

class Usuario_Controller extends Controller{
    constructor(){
        super(usuario_services,camposObrigatorios)
    }

    async registerUsuario_Controller(req,res){
        const {email} = req.body;
        const bodyReq = req.body;
        
        try{
            const isTrue = await this.allowNull(req, res);
            //valida campos obrigatorios
            if(isTrue.status){
                //checar se o usuario existe
                const userExist = await usuario_services.pegaUsuarioPorEmail_Services(email)
                if(userExist.status){
                    return res.status(422).json({
                        message:"O e-mail informado já está em uso!",
                        error:true
                    });
                }
                //gerando senha cripto
                const salt = await bcrypt.genSalt(12);
                const senhaHash = await bcrypt.hash(bodyReq.senha, salt);
                bodyReq.senha = senhaHash;
                //criando usuario
                const createUser = await usuario_services.cadastraUsuario_Services(bodyReq);

                if(createUser.status){
                    return res.status(200).json({ 
                        message: `usuario cadastrado com sucesso`,
                        error:false
                    });
                }else{
                    return res.status(500).json({ 
                        message: createUser.message || `erro ao cadastrar o usuario`,
                        error:true
                    });
                }
            }else{
                return res.status(500).json({
                    message: 'Preencha todos os campos necessarios',
                    campos: isTrue.campos,
                    error: true,
                });
            }
        }catch(e){
            console.log(e);
            return res.status(500).json({
                message: `erro ao buscar registro, contate o administrador do sistema`,
                error:true 
            });
        }
    }

    async loginUsuario_Controller(req,res){
        const {email, senha} = req.body;
        let emailExist ='';

        if(!email) return res.status(422).json({message:"Por favor, insira um email"});
        if(!senha) return res.status(422).json({message:"Por favor, preencha uma senha"});
        if(email) emailExist = await usuario_services.pegaUsuarioPorEmail_Services(email);

        let checkSenha ='';
        if(emailExist.status){
            checkSenha = await usuario_services.validaSenhaUsuario_Services(email, senha);
        }
        if(!checkSenha.status){
            return res.status(401).json({error:true, message:"E-mail ou Senha incorreta"});
        }
        return res.status(200).json({message:"Autentiação realizada com sucesso",token: checkSenha.token, error:false})
    }

    async deletaUsuarioPorId_Controller(req,res){
        const { id } = req.params;
        try {
            const usuario = await usuario_services.deletaUsuarioPorId_Services(id);
            if(usuario === 0){
                return res.status(400).json({message: `id ${id} não encontrado`,usuario,error:true})
            }else{
                return res.status(200).json({ message: `id ${id} deletado`,usuario,error:false});
            }
        } catch (error) {
            return res.status(500).json({message: `erro ao buscar registro, contate o administrador do sistema`});
        }
    }

    async pegaPedidosPorCodCliEColecao_Controller(req, res) {
        try {
          const { codcli } = req.params;
          //PAGINACAO
          const { page = 1 } = req.query;
          //limite de registros em cada pagina
          const limit = 9;
          var lastPage = 1;
    
          //consultando quantidade de pedidos encontrados por codcli
          const countPedidos = await sisplan.Pedido_001.count({where:{codcli: codcli}})
  
          //valida contagem
          if(countPedidos !== 0){
            lastPage = Math.ceil(countPedidos  / limit)
            
            //Criando objeto com as informações de paginacao
            var paginacao ={
              //caminho
              path: '/api/pedido/cliente/cliente/pedido/',
              total_Pedidos:countPedidos,
              limit_por_page:limit,
              current_page:page,
              total_Pages:lastPage,
              prev_page_url: page - 1 >= 1 ? page -1: false,
              next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + 1,
            }
          }else{
            return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
          }
          const infoLimit = (page * limit) - limit
  
          const pedidos = await pedido_001_services.pegaPedidosPorCodCli_Service(codcli,infoLimit,limit);
          if(pedidos.retorno.length === 0){
            return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
          }else{
  
            return res.status(200).json({pedidos:pedidos,paginacao});
          }
        } catch (erro){
          return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro: ${erro}` });
        }
      }
}

module.exports = Usuario_Controller;