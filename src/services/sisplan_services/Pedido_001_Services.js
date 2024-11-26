const Services = require('../Services.js');
const db = require('../../models/index.js')

const { Op } = require('sequelize');

class Pedido_001_Services extends Services {
    constructor() {
        super('Pedido_001');
    }

    async pegaPedidosPorCodCliEColecao_Service(codcli,colecao,infoLimit,limit) {
        const pedidos = await db.sisplan.Pedido_001.findAll({
            attributes:['codcli', 'numero','ped_cli', 'codrep', 'dt_emissao', 'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'],
            include:[
                {
                    model: db.sisplan.Entidade_001,
                    as: 'info_cliente',
                    attributes:['nome','email','telefone','cnpj','num_rg'],
                },
                {
                    model: db.sisplan.Sitprod_001,
                    as:'situacao_pedido',
                    attributes:['codigo','descricao'],
                }
            ],
            where: { codcli: codcli, colecao:colecao },
            offset: Number(infoLimit),
            limit:Number(limit),
            order:[['numero','DESC']],
        });

        // Array para armazenar os números dos pedidos Encontrados
        const pedidosEncontrados = pedidos.map(pedido => pedido.numero);

        // Consulta para buscar os itens do pedido usando os números dos pedidosEncontrados
        const itensPedido = await db.sisplan.Ped_iten_001.findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','qtde', 'qtde_f', 'preco'],
            where: { numero: pedidosEncontrados },
            order:[
                ['codigo','ASC'],
                ['tam','ASC']
            ],
            include:[{
                model: db.sisplan.Produto_001,
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

    async pegaPedidosFiltradosPorCodCliEColecao_Service(codcli, colecao, infoLimit, limit, regiaoFiltro, filtroNumPed) {
        // Configura o include do info_cliente dinamicamente
        const includeInfoCliente = {
            model: db.sisplan.Entidade_001,
            as: 'info_cliente',
            attributes: ['nome', 'email', 'telefone', 'cnpj', 'num_rg'],
        };
    
        // Adiciona a condição ao where apenas se regiaoFiltro tiver valores
        if (Array.isArray(regiaoFiltro) && regiaoFiltro.length > 0) {
            includeInfoCliente.where = { reg_estado: regiaoFiltro };
        }
    
        // Configura o filtro condicional para ped_cli
        const whereCondition = {
            codcli: codcli,
            colecao: colecao,
        };
    
        // Adiciona a busca parcial em ped_cli somente se filtroNumPed for informado
        if (filtroNumPed && filtroNumPed.trim() !== '') {
            whereCondition.ped_cli = {
                [db.Sequelize.Op.like]: `%${filtroNumPed}%`, // Busca parcial
            };
        }
    
        // Consulta os pedidos
        const pedidos = await db.sisplan.Pedido_001.findAll({
            attributes: [
                'codcli', 'numero', 'ped_cli', 'codrep', 'dt_emissao',
                'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'
            ],
            include: [
                includeInfoCliente,
                {
                    model: db.sisplan.Sitprod_001,
                    as: 'situacao_pedido',
                    attributes: ['codigo', 'descricao'],
                },
            ],
            where: whereCondition,
            offset: Number(infoLimit),
            limit: Number(limit),
            order: [['numero', 'DESC']],
        });
    
        // Array para armazenar os números dos pedidos encontrados
        const pedidosEncontrados = pedidos.map(pedido => pedido.numero);
    
        // Consulta para buscar os itens do pedido usando os números dos pedidosEncontrados
        const itensPedido = await db.sisplan.Ped_iten_001.findAll({
            attributes: ['numero', 'codigo', 'tam', 'cor', 'qtde', 'qtde_f', 'preco'],
            where: { numero: pedidosEncontrados },
            order: [
                ['codigo', 'ASC'],
                ['tam', 'ASC']
            ],
            include: [{
                model: db.sisplan.Produto_001,
                as: 'detalhes_produto',
                attributes: ['descricao', 'descricao2', 'unidade', 'estoque'],
            }],
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
        const pedidos = await db.sisplan.Pedido_001.findAll({
            attributes:['codcli', 'numero', 'ped_cli', 'codrep', 'dt_emissao', 'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'],
            where: { codcli: codcli,numero: pedido },
            include:[
                {
                    model: db.sisplan.Entidade_001,
                    as: 'info_cliente',
                    attributes:['nome','email','telefone','cnpj','num_rg'],
                },
                {
                    model: db.sisplan.Sitprod_001,
                    as:'situacao_pedido',
                    attributes:['codigo','descricao'],
                }
            ],
        });

        // Consulta para buscar os itens do pedido usando os números dos pedidosEncontrados
        const itensPedido = await db.sisplan.Ped_iten_001.findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','qtde', 'qtde_f', 'preco'],
            where: { numero: pedido },
            order:[
                ['codigo','ASC'],
                ['tam','ASC'],
            ],
            include:[{
                model: db.sisplan.Produto_001,
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

    async pegaPedidosPorCodCliColecaoEDatas_Services(codcliArray,colecaoArray, dataInicio, dataFim) {
        const pedidos = await db.sisplan.Pedido_001.findAll({
            attributes:['codcli', 'numero','ped_cli', 'codrep', 'dt_emissao', 'dt_fatura', 'dt_saida', 'entrega', 'nota', 'deposito'],
            include:[
                {
                    model: db.sisplan.Entidade_001,
                    as: 'info_cliente',
                    attributes:['nome','email','telefone','cnpj','num_rg'],
                },
                {
                    model: db.sisplan.Sitprod_001,
                    as:'situacao_pedido',
                    attributes:['codigo','descricao'],
                }
            ],
            where: {
                codcli: codcliArray,
                colecao:colecaoArray,
                dt_emissao:{
                    [Op.between]: [dataInicio, dataFim]
                }
             },
            order:[['numero','DESC']],
        });

        // Array para armazenar os números dos pedidos Encontrados
        const pedidosEncontrados = pedidos.map(pedido => pedido.numero);

        // Consulta para buscar os produtos do pedido usando os números dos pedidosEncontrados
        const itensPedido = await db.sisplan.Ped_iten_001.findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','qtde', 'qtde_f', 'preco'],
            where: { numero: pedidosEncontrados },
            order:[
                ['codigo','ASC'],
                ['tam','ASC']
            ],
            include:[{
                model: db.sisplan.Produto_001,
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