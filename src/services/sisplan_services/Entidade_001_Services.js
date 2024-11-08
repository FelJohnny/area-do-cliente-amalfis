const Services = require('../Services.js')
const {sisplan, sequelizeSisplan} = require('../../models/index.js')
const {Op} = require('sequelize')
class Entidade_001_Services extends Services{
    constructor(){
        super('Entidade_001')
    }

    async pegaEntidadePorCodCli_Services(codcli){
        const retorno = await sisplan.Entidade_001.findAll({
            attributes:['codcli','nome','email','telefone','cnpj','num_rg','grupo','reg_estado'],
            where:{codcli: codcli},
            include:[
                {
                    model: sisplan.Contato_001,
                    as: 'cli_contatos',
                    attributes:['id','nome','numero','email','celular','tipo','tipo_contato'],
                },
                {
                    model: sisplan.Reg_estado_001,
                    as: 'regiao_cli',
                    attributes:['codigo','descricao','obs'],
                },
            ]
        })
        if(retorno.length === 0){
            console.log('registro não encontrado na base de dados');
            return { error:true, retorno: retorno };
        }else{
            //dado
            console.log('registro foi encontrado na base de dados');
            return { retorno: retorno,error:false };

        }
    }

    async pegaEntidadePorGrupocli_Services(grupo){
        const retorno = await sisplan.Entidade_001.findAll({
            attributes:['codcli','nome','email','telefone','cnpj','num_rg','grupo'],
            where:{grupo: grupo},
            include:{
                model: sisplan.Contato_001,
                as: 'cli_contatos',
                attributes:['id','nome','numero','email','celular','tipo','tipo_contato'],
            },
        })
        if(retorno.length === 0){
            console.log('registro não encontrado na base de dados');
            return { error:true, retorno: retorno };
        }else{
            //dado
            console.log('registro foi encontrado na base de dados');
            return { retorno: retorno,error:false };

        }
    }

    async pegaEntidadePorNome_Services(nome){
        const retorno = await sisplan.Entidade_001.findAll({
            attributes: ['codcli', 'nome', 'email', 'telefone', 'cnpj', 'num_rg', 'grupo'],
            where: {
                [Op.and]: [
                    sequelizeSisplan.where(
                        sequelizeSisplan.fn('LOWER', sequelizeSisplan.col('Entidade_001.nome')),  // Especifica a tabela Entidade_001
                        {
                            [Op.like]: `%${nome.toLowerCase()}%`
                        }
                    )
                ]
            },
            include: {
                model: sisplan.Contato_001,
                as: 'cli_contatos',
                attributes: ['id', 'nome', 'numero', 'email', 'celular', 'tipo', 'tipo_contato'],
            },
        });
        if(retorno.length === 0){
            console.log('registro não encontrado na base de dados');
            return { error:true, retorno: retorno };
        }else{
            //dado
            console.log('registro foi encontrado na base de dados');
            return { retorno: retorno,error:false };

        }
    }

    
}

module.exports=Entidade_001_Services
