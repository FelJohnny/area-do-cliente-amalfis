
const Controller = require('../Controller.js');
const Pedido_001_Services = require('../../services/sisplan_services/Pedido_001_Services.js');
const Clientes_Usuario_Services = require('../../services/amfcli_services/clientes_usuario_Services.js')
const {sisplan, amalfisCli} = require('../../models/index.js')
const { Op } = require("sequelize");
const nodemailer = require("nodemailer") ;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();
const pedido_001_services = new Pedido_001_Services();

const clientes_usuario_services = new Clientes_Usuario_Services();

class Pedido_001_Controller extends Controller{
    constructor(){
        super(pedido_001_services);
    }

    async pegaPedidosPorCodCliEColecao_Controller(req, res) {
      try {
        const { id } = req.params;
        //PAGINACAO
        const { page = 1 } = req.query;
        //limite de registros em cada pagina
        const limit = 9;
        var lastPage = 1;
  
        //consultando os clientes que estão vinculados no usuario
        const ClientesPusuario = await clientes_usuario_services.pegaCodcliPorId_Services(id);
        const codcliArray = [];
        ClientesPusuario.forEach(cliente => {
          codcliArray.push(cliente.dataValues.codcli);
        });

        //consultando regiões cadastradas nos clientes vinculados ao usuario // para filtros do frontend
        const RegiaoPusuario = await sisplan.Entidade_001.findAll({
          where:{codcli:codcliArray},
          attributes:[],
          include:{
            model: sisplan.Reg_estado_001,
            as: 'regiao_cli',
            attributes:['codigo','descricao','obs'],
        },
        })
        

        //consultando os coleções que estão vinculados no usuario
        const ColecoesPusuario = await amalfisCli.Colecao_usuarios.findAll({
          where:{usuario_id:id},
          attributes:['codigo']
        });


        const colecaoArray = []
        ColecoesPusuario.forEach(colecao => {
          colecaoArray.push(colecao.dataValues.codigo);
        });

        //consultando quantidade de pedidos encontrados por codcli e colecao
        const countPedidos = await sisplan.Pedido_001.count({where:{codcli: codcliArray,colecao:colecaoArray}})

        //valida contagem
        if(countPedidos !== 0){
          lastPage = Math.ceil(countPedidos  / limit)
          
          //Criando objeto com as informações de paginacao
          var paginacao ={
            //caminho
            path: '/api/pedido/cliente/usuario-id/',
            total_Pedidos:countPedidos,
            limit_por_page:limit,
            current_page:page,
            total_Pages:lastPage,
            prev_page_url: page - 1 >= 1 ? page -1: false,
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + 1,
          }
        }else{
          return res.status(400).json({message:`não foi possivel encontrar os pedidos`});
        }
        const infoLimit = (page * limit) - limit

        const pedidos = await pedido_001_services.pegaPedidosPorCodCliEColecao_Service(codcliArray,colecaoArray,infoLimit,limit);
        if(pedidos.retorno.length === 0){
          return res.status(400).json({message:`não foi possivel encontrar os pedidos`});
        }else{

          return res.status(200).json({pedidos:pedidos,regioes:RegiaoPusuario,clientes: codcliArray,paginacao,});
        }
      } catch (erro){
        console.log(erro);
        return res.status(500).json({ message: `erro ao buscar os pedidos` });
      }
    }

    async pegaPedidoComFiltro(req, res) {
      try {
        const { id } = req.params;
        const { regiaoFiltro = [], clienteFiltro = [], filtroNumPed = '' } = req.body;
        const { page = 1 } = req.query;
        const limit = 9;
        let lastPage = 1;
        
        // Consultar clientes vinculados ao usuário
        const ClientesPusuario = await amalfisCli.Clientes_usuarios.findAll({
          where: { usuario_id: id },
          attributes: ['codcli'],
        });
    
        const codcliArray = ClientesPusuario.map((cliente) => cliente.dataValues.codcli);
    
        // Consultar coleções vinculadas ao usuário
        const ColecoesPusuario = await amalfisCli.Colecao_usuarios.findAll({
          where: { usuario_id: id },
          attributes: ['codigo'],
        });
    
        const colecaoArray = ColecoesPusuario.map((colecao) => colecao.dataValues.codigo);
    
        // Lógica para construir a lista de clientes a partir dos filtros
        let codcliArrayFiltro = [...codcliArray];
    
        if (Array.isArray(clienteFiltro) && clienteFiltro.length > 0) {
          // Se clienteFiltro estiver definido, use apenas os clientes no filtro
          codcliArrayFiltro = codcliArrayFiltro.filter((codcli) => clienteFiltro.includes(codcli));
        }
    
        if (Array.isArray(regiaoFiltro) && regiaoFiltro.length > 0) {
          // Filtrar entidades por região
          const entidadesFiltradas = await sisplan.Entidade_001.findAll({
            attributes: ['codcli'],
            where: {
              codcli: codcliArrayFiltro,
              reg_estado: { [Op.in]: regiaoFiltro },
            },
          });
    
          // Atualizar `codcliArrayFiltro` com base nas regiões
          codcliArrayFiltro = entidadesFiltradas.map((entidade) => entidade.dataValues.codcli);
        }
    
        // Contar pedidos com base nos filtros aplicados
        const countPedidos = await sisplan.Pedido_001.count({
          where: {
            codcli: codcliArrayFiltro,
            colecao: colecaoArray,
            ...(filtroNumPed && filtroNumPed.trim() !== '' && {
              ped_cli: { [Op.like]: `%${filtroNumPed}%` }, // Filtro parcial
            }),
          },
        });
    
        if (countPedidos === 0) {
          return res.status(400).json({ message: 'Não foi possível encontrar os pedidos' });
        }
    
        lastPage = Math.ceil(countPedidos / limit);
    
        // Configuração de paginação
        const paginacao = {
          path: '/api/pedido/cliente/usuario-id/',
          total_Pedidos: countPedidos,
          limit_por_page: limit,
          current_page: page,
          total_Pages: lastPage,
          prev_page_url: page - 1 >= 1 ? page - 1 : false,
          next_page_url: Number(page) + 1 > lastPage ? false : Number(page) + 1,
        };
    
        // Calcular offset para paginação
        const infoLimit = (page - 1) * limit;
    
        // Buscar pedidos com os filtros aplicados
        const pedidos = await pedido_001_services.pegaPedidosFiltradosPorCodCliEColecao_Service(
          codcliArrayFiltro,
          colecaoArray,
          infoLimit,
          limit,
          regiaoFiltro,
          filtroNumPed
        );
    
        if (pedidos.retorno.length === 0) {
          return res.status(400).json({ message: 'Não foi possível encontrar os pedidos' });
        }
    
        return res.status(200).json({
          pedidos: pedidos,
          clientes: codcliArrayFiltro,
          paginacao,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar os pedidos' });
      }
    }
    


    async pegaUmPedidoPorCodCli_Controller(req, res) {
      
      const { codcli, pedido } = req.params;
      try {
        const pedidos = await pedido_001_services.pegaUmPedidoPorCodCli_Service(codcli,pedido);
        if(pedidos.retorno.length === 0){
          return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
        }else{
          return res.status(200).json(pedidos);
        }
      } catch (erro){
        console.log(erro);
        return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro` });
      }
    }

    async enviaPedidoEmail_Controller(req,res){
      
      try{
        const {codcli, pedido } = req.params;
        //validando existencia de pedido
        const validaPedido = await pedido_001_services.pegaUmPedidoPorCodCli_Service(codcli,pedido);
        if(validaPedido.retorno.length === 0){
          return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
        }
        const transporter = nodemailer.createTransport({
          host:process.env.HOST,
          port: process.env.PORT,
          secure: true,
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.PASS
          }
        })

        // Lendo o arquivo HTML
        const emailTemplatePath = path.join(__dirname, '../views/emails/emailTemplate.html');
        let emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

        const { nome, email } =validaPedido.retorno[0].info_cliente
        const { dt_emissao, ped_cli, situacao_pedido, numero } = validaPedido.retorno[0]

        // Substituir os placeholders pelos valores reais
        emailTemplate = emailTemplate.replace('{{clientName}}', nome || 'NÃO CADASTRADO');
        emailTemplate = emailTemplate.replace('{{dt_emissao}}', dt_emissao || 'NÃO CADASTRADA');
        emailTemplate = emailTemplate.replace('{{ped_cli}}', ped_cli || 'NÃO INFORMADO');
        //O operador ?. permite acessar propriedades profundamente aninhadas de um objeto sem causar um erro se uma parte intermediária for null ou undefined.
        emailTemplate = emailTemplate.replace('{{orderDetails}}',  situacao_pedido?.descricao || 'AGUARDANDO ANALISE');

        if(email){
          const mailOptions = {
            from: process.env.EMAIL_FROM,
            // to: email,
            to: process.env.RECEBEEMAIL,
            subject: `Amalfis Cliente - Situação pedido: ${ped_cli || numero} `,
            attachments: [
              {
                filename: 'logo.png',
                path: path.join(__dirname, '../views/emails/logo.png'),
                cid: 'logo'
              }
            ],
            html:emailTemplate,
          };
          
          try{
            const info = await transporter.sendMail(mailOptions);
              console.log("Email envia com sucesso " + info.response);
              return res.status(200).json({message:`email enviado com sucesso para: ${email}`});
          }catch(e){
            return res.status(500).json({ message: "Não foi possivel enviar o email, Tente novamente ou contate o administrador do sistema" });
          }
        }
      }catch(erro){
        console.error('Erro ao enviar email:', erro);
        return res.status(500).json({ message: `erro ao enviar e-mail`});
      }
    }

    async pegaPedidosPorCodCliColecaoEDatas_Controller(req,res){
      try {
        const { id } = req.params;
        const { dataInicio, dataFim } = req.query;

        //consultando os clientes que estão vinculados no usuario
        const ClientesPusuario = await clientes_usuario_services.pegaCodcliPorId_Services(id);
        const codcliArray = [];
        ClientesPusuario.forEach(cliente => {
          codcliArray.push(cliente.dataValues.codcli);
        });
        
        //consultando os coleções que estão vinculados no usuario
        console.log(id);
        
        const ColecoesPusuario = await amalfisCli.Colecao_usuarios.findAll({
          where:{usuario_id:id},
          attributes:['codigo']
        });

        const colecaoArray = []
        ColecoesPusuario.forEach(colecao => {
          colecaoArray.push(colecao.dataValues.codigo);
        });

        const pedidos = await pedido_001_services.pegaPedidosPorCodCliColecaoEDatas_Services(codcliArray,colecaoArray, dataInicio, dataFim)
        if(pedidos.length === 0){
          return res.status(400).json({message:`não foi possivel encontrar o registro: ${codcli}`});
        }else{
          return res.status(200).json(pedidos);
        }

      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro` });
        
      }
    }
}

module.exports = Pedido_001_Controller