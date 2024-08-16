const Services = require('../Services.js');
const {amalfisCli, sequelizeAmalfisCli } = require('../../models/index.js')
const { Op } = require('sequelize');
const { validate: isUuid } = require('uuid');
const uuid = require('uuid')

class Usuario_Services extends Services{

    async pegaUsuarioPorEmail(email){
        const retorno = await amalfisCli.Usuario.findOne({where: {email: email}})
        if(retorno === null){
            console.log('email não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }else{
            console.log('email foi encontrado na base de dados');
            return {status:true, retorno: retorno};
        }

    }

    async cadastraUsuario_Services(bodyReq) {
        const transaction = await sequelizeAmalfisCli.transaction(); // Inicia a transação
    
        try {
            // Valida se os role_id são UUIDs válidos
            if (!bodyReq.roles_id.every(id => isUuid(id))) {
                return { status: false, message: 'Um ou mais roles_id são inválidos.' };
            }
    
            // Valida se os permissao_id são UUIDs válidos
            if (!bodyReq.permissoes_id.every(id => isUuid(id))) {
                return { status: false, message: 'Um ou mais permissoes_id são inválidos.' };
            }
    
            // Verifica se role_id existe no banco de dados
            const roles = await amalfisCli.Role.findAll({
                where: {
                    id: {
                        [Op.in]: bodyReq.roles_id
                    }
                },
                transaction
            });
    
            if (roles.length !== bodyReq.roles_id.length) {
                return { status: false, message: 'Uma ou mais roles não foram encontradas.' };
            }
    
            // Verifica se permissao_id existe no banco de dados
            const permissoes = await amalfisCli.Permissao.findAll({
                where: {
                    id: {
                        [Op.in]: bodyReq.permissoes_id
                    }
                },
                transaction
            });
    
            if (permissoes.length !== bodyReq.permissoes_id.length) {
                return { status: false, message: 'Uma ou mais permissões não foram encontradas.' };
            }
    
            // Cria o usuário dentro da transação
            const usuario = await amalfisCli.Usuario.create({ id: uuid.v4(), ...bodyReq }, { transaction });
    
            if(usuario === null){
                console.log('usuario nao cadastrado');
                await transaction.rollback(); // Faz o rollback caso o usuário não seja criado
                return {status:false};
            }
    
            // Adiciona roles ao usuário
            await usuario.addUsuario_roles(bodyReq.roles_id, { transaction });
    
            // Adiciona permissoes ao usuário
            await usuario.addUsuario_permissoes(bodyReq.permissoes_id, { transaction });
    
            // Cria coleções e as associa ao usuário
            if (bodyReq.colecao && Array.isArray(bodyReq.colecao)) {
                for (const colecao of bodyReq.colecao) {
                    const novaColecao = await amalfisCli.Colecao_usuarios.create({
                        usuario_id: usuario.id,  // Adicionando a referência do usuário criado
                        codigo: colecao.codigo,
                        descricao: colecao.descricao
                    }, { transaction });
                    await usuario.addUsuario_colecoes(novaColecao.id, { transaction });
                }
            }
    
            // Cria clientes e os associa ao usuário
            if (bodyReq.clientes && Array.isArray(bodyReq.clientes)) {
                for (const cliente of bodyReq.clientes) {
                    const novoCliente = await amalfisCli.Clientes_usuarios.create({
                        usuario_id: usuario.id,  // Adicionando a referência do usuário criado
                        codcli: cliente.codcli,
                        nome: cliente.nome,
                        cnpj: cliente.cnpj,
                        rg: cliente.rg
                    }, { transaction });
                    await usuario.addUsuario_clientes(novoCliente.id, { transaction });
                }
            }
    
            // Se tudo deu certo, commit na transação
            await transaction.commit();
            console.log('usuario cadastrado com sucesso');
            return { status: true };
    
        } catch (e) {
            await transaction.rollback(); // Faz o rollback caso ocorra qualquer erro
            console.error('Erro na associação', e);
            return { status: false, message: 'Erro na associação', error: e.message };
        }finally {
            if (!transaction.finished) await transaction.rollback(); // Assegura que a transação seja finalizada
        }
    }
}

module.exports = Usuario_Services