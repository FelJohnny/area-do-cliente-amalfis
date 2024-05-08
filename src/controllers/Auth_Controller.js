const Controller = require('./Controller.js');
const Auth_Services = require('../services/Auth_Services.js')
const jwt = require('jsonwebtoken');


const auth_services = new Auth_Services();

class Auth_Controller extends Controller{
    constructor(){
        super(auth_services)
    }

    async LoginUsuario_Controller(req,res){
        const {email, senha} = req.body;
        let emailExist ='';

        if(!email){
            return res.status(422).json({message:"Por favor, insira um email"});
          }
          if(!senha){
            return res.status(422).json({message:"Por favor, preencha uma senha"});
          }
          //validando existencia no banco
        if(email){
            emailExist = await auth_services.pegaRegistroPorEmail_Services(email);
        }
        
        let checkSenha ='';
        if(emailExist.status){
            console.log("email existe");
            checkSenha = await auth_services.validaSenhaUsuario_Services(email, senha);
        }
        if(!checkSenha.status){
            return res.status(401).json({message:"E-mail ou Senha incorreta. Tente novamente!"});
        }

        try {
                const secret = process.env.SECRET_LOGIN;
                let token=''
                const TokenExpirationTime = '1d'
                console.log(checkSenha.nome);
                if(emailExist.status){
                token = jwt.sign({
                    codcli: checkSenha.retorno.codcli,
                    nome:checkSenha.retorno.nome,
                },secret,{ expiresIn: TokenExpirationTime })
            }
            console.log(token);
            return res.status(200).json({message:"Autentiação realizada com sucesso",token})
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: `erro ao logar, mensagem do erro:${error}` });
        }
    }
}

module.exports = Auth_Controller;