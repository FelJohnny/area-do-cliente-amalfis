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
                const userExist = await usuario_services.pegaUsuarioPorEmail(email)
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
}

module.exports = Usuario_Controller;