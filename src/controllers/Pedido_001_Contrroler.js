
const Controller = require('./Controller.js');
const Pedido_001_Services = require('../services/Pedido_001_Services.js');
const model = require('../models/index.js')
const nodemailer = require("nodemailer") ;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();
const pedido_001_services = new Pedido_001_Services();

class Pedido_001_Controller extends Controller{
    constructor(){
        super(pedido_001_services);
    }

    async pegaPedidosPorCodCli_Controller(req, res) {
      try {
        const { codcli } = req.params;
        //PAGINACAO
        const { page = 1 } = req.query;
        //limite de registros em cada pagina
        const limit = 9;
        var lastPage = 1;
  
        //consultando quantidade de pedidos encontrados por codcli
        const countPedidos = await model.Pedido_001.count({where:{codcli: codcli}})

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
        return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro: ${erro}` });
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
}

module.exports = Pedido_001_Controller