const Services = require('./Services.js');
const model = require('../models/index.js');
const { Op } = require('sequelize');

class Pedido_001_Services extends Services {
    constructor() {
        super('Pedido_001');
    }

    async pegaPedidosPorCodCli_Service(codcli, infoLimit,limit) {
        const pedidos = await model.Pedido_001.findAll({
            attributes:['codcli', 'numero','ped_cli', 'codrep', 'dt_emissao', 'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'],
            include:[
                {
                    model: model.Entidade_001,
                    as: 'info_cliente',
                    attributes:['nome','email','telefone','cnpj','num_rg'],
                },
                {
                    model: model.Sitprod_001,
                    as:'situacao_pedido',
                    attributes:['codigo','descricao'],
                }
            ],
            where: { codcli: codcli },
            offset: Number(infoLimit),
            limit:Number(limit),
            order:[['numero','DESC']],
        });

        // Array para armazenar os números dos pedidos Encontrados
        const pedidosEncontrados = pedidos.map(pedido => pedido.numero);

        // Consulta para buscar os itens do pedido usando os números dos pedidosEncontrados
        const itensPedido = await model.Ped_iten_001.findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','qtde', 'qtde_f', 'preco'],
            where: { numero: pedidosEncontrados },
            order:[
                ['codigo','ASC'],
                ['tam','ASC']
            ],
            include:[{
                model: model.Produto_001,
                as:'detalhes_produto',
                attributes:['descricao','descricao2','unidade','estoque'],
            }]
        });

        // Adicionando os itens de pedido aos resultados dos pedidos
        const pedidosComItens = pedidos.map(pedido => {
            pedido.dataValues.itens_pedido = itensPedido.filter(item => item.numero === pedido.numero);
            return pedido;
        });

        if (pedidosComItens.length === 0) {
            console.log('Nenhum registro encontrado na base de dados.');
            return { error: true, retorno: pedidosComItens };
        } else {
            console.log('Registros encontrados na base de dados.');
            return { retorno: pedidosComItens, error: false };
        }
    }

    async pegaUmPedidoPorCodCli_Service(codcli, pedido){
        const pedidos = await model.Pedido_001.findAll({
            attributes:['codcli', 'numero', 'ped_cli', 'codrep', 'dt_emissao', 'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'],
            where: { codcli: codcli,numero: pedido },
            include:[
                {
                    model: model.Entidade_001,
                    as: 'info_cliente',
                    attributes:['nome','email','telefone','cnpj','num_rg'],
                },
                {
                    model: model.Sitprod_001,
                    as:'situacao_pedido',
                    attributes:['codigo','descricao'],
                }
            ],
        });

        // Consulta para buscar os itens do pedido usando os números dos pedidosEncontrados
        const itensPedido = await model.Ped_iten_001.findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','qtde', 'qtde_f', 'preco'],
            where: { numero: pedido },
            order:[
                ['codigo','ASC'],
                ['tam','ASC'],
            ],
            include:[{
                model: model.Produto_001,
                as:'detalhes_produto',
                attributes:['descricao','descricao2','unidade','estoque'],
            }]
        });

        // Adicionando os itens de pedido aos resultados dos pedidos
        const pedidosComItens = pedidos.map(pedido => {
            pedido.dataValues.itensPedido = itensPedido.filter(item => item.numero === pedido.numero);
            return pedido;
        });

        if (pedidosComItens.length === 0) {
            console.log('Nenhum registro encontrado na base de dados.');
            return { error: true, retorno: pedidosComItens };
        } else {
            console.log('Registros encontrados na base de dados.');
            return { retorno: pedidosComItens, error: false };
        }
    }

    async pegaPedidosPorCodCliDatas_Service(codcli, dataInicio, dataFim) {
        const pedidos = await model.Pedido_001.findAll({
            attributes:['codcli', 'numero','ped_cli', 'codrep', 'dt_emissao', 'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'],
            include:[
                {
                    model: model.Entidade_001,
                    as: 'info_cliente',
                    attributes:['nome','email','telefone','cnpj','num_rg'],
                },
                {
                    model: model.Sitprod_001,
                    as:'situacao_pedido',
                    attributes:['codigo','descricao'],
                }
            ],
            where: {
                codcli: codcli,
                dt_emissao:{
                    [Op.between]: [dataInicio, dataFim]
                }
             },
            order:[['numero','DESC']],
        });

        // Array para armazenar os números dos pedidos Encontrados
        const pedidosEncontrados = pedidos.map(pedido => pedido.numero);

        // Consulta para buscar os produtos do pedido usando os números dos pedidosEncontrados
        const itensPedido = await model.Ped_iten_001.findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','qtde', 'qtde_f', 'preco'],
            where: { numero: pedidosEncontrados },
            order:[
                ['codigo','ASC'],
                ['tam','ASC']
            ],
            include:[{
                model: model.Produto_001,
                as:'detalhes_produto',
                attributes:['descricao','descricao2','unidade','estoque'],
            }]
        });

        // Adicionando os itens de pedido aos resultados dos pedidos
        const pedidosComItens = pedidos.map(pedido => {
            pedido.dataValues.itens_pedido = itensPedido.filter(item => item.numero === pedido.numero);
            return pedido;
        });
        return pedidosComItens;
    }
}

module.exports = Pedido_001_Services;