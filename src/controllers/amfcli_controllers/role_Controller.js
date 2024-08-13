const Controller = require('../Controller.js')
const Role_Services = require('../../services/amfcli_services/role_Services.js')

const role_services = new Role_Services();
const camposObrigatorios = ['nome','descricao']

class Role_Controller extends Controller{
    constructor(){
        super(role_services,camposObrigatorios)
    }

    async pegaTodosRole_Controller(req, res) {
        try {
          const listaDeRegistro = await role_services.pegaTodosRole_Services();
          return res.status(200).json(listaDeRegistro);
        } catch (e) {
          console.log(e);
          return res.status(500).json({ message: `erro ao buscar registro, contate o administrador do sistema` });
        }
    }

    async criaRole_Controller(req,res){
        const isTrue = await this.allowNull(req,res);
        try{
            if(isTrue.status){
                const {nome, descricao} = req.body;
                const role = await role_services.criaRole_Services({nome, descricao});
                if(role.error){
                    return res.status(500).json({
                        message:'já existe uma role com o nome informado',
                        error:role.error,
                    })
                }else{
                    return res.status(200).json({
                        message:'Cargo criado',
                        error: role.error,
                        role:role,
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

    
}

module.exports = Role_Controller;