const Services = require('../Services.js');
const {amalfisCli, sequelizeAmalfisCli } = require('../../models/index.js')
const { Op } = require('sequelize');
const { validate: isUuid } = require('uuid');
const uuid = require('uuid')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class Usuario_Services extends Services{
    
    // Serviço para buscar todos os usuários
    async pegaTodosUsuarios_Services() {
        try {
            const usuarios = await amalfisCli.Usuario.findAll({
                attributes: ['id', 'nome', 'email', 'contato', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: amalfisCli.Role,
                        as: 'usuario_roles',
                        attributes: ['id', 'nome', 'descricao'],
                        through: { attributes: [] }
                    },
                    {
                        model: amalfisCli.Permissao,
                        as: 'usuario_permissoes',
                        attributes: ['id', 'nome', 'descricao'],
                        through: { attributes: [] },
                        include: [
                            {
                                model: amalfisCli.UserPermissionAccess,
                                as: 'user_permissions_access',
                                attributes: ['can_create', 'can_read', 'can_update', 'can_delete']
                            }
                        ]
                    },
                    {
                        model: amalfisCli.Clientes_usuarios,
                        as: 'usuario_clientes',
                        attributes: ['codcli', 'nome', 'cnpj']
                    },
                    {
                        model: amalfisCli.Colecao_usuarios,
                        as: 'usuario_colecoes',
                        attributes: ['codigo', 'descricao']
                    }
                ]
            });

            if (!usuarios.length) {
                return { status: false, usuarios: [] };
            }

            // Formata cada usuário com as permissões agrupadas por tela
            const formattedUsuarios = usuarios.map(usuario => {
                const permissoesPorTela = usuario.usuario_permissoes.reduce((acc, permissao) => {
                    const telaNome = permissao.nome;

                    if (!acc[telaNome]) {
                        acc[telaNome] = {
                            tela: telaNome,
                            permissoes: []
                        };
                    }

                    const crudPermissions = permissao.user_permissions_access[0];
                    acc[telaNome].permissoes.push({
                        permissao_id: permissao.id,
                        can_create: crudPermissions?.can_create || false,
                        can_read: crudPermissions?.can_read || false,
                        can_update: crudPermissions?.can_update || false,
                        can_delete: crudPermissions?.can_delete || false
                    });

                    return acc;
                }, {});

                return {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    contato: usuario.contato,
                    createdAt: usuario.createdAt,
                    updatedAt: usuario.updatedAt,
                    usuario_roles: usuario.usuario_roles,
                    usuario_clientes: usuario.usuario_clientes,
                    usuario_colecoes: usuario.usuario_colecoes,
                    usuario_permissoes_por_tela: Object.values(permissoesPorTela)
                };
            });

            return { status: true, usuarios: formattedUsuarios };
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao buscar usuários");
        }
    }


    async pegaUsuarioPorId_Services(id) {
        const usuario = await amalfisCli.Usuario.findOne({
            where: { id: id },
            include: [
                {
                    model: amalfisCli.Role,
                    as: 'usuario_roles',
                    attributes: ['id', 'nome', 'descricao'],
                    through: { attributes: [] } // Exclui os atributos da tabela de junção
                },
                {
                    model: amalfisCli.Permissao,
                    as: 'usuario_permissoes',
                    attributes: ['id', 'nome', 'descricao'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: amalfisCli.UserPermissionAccess,
                            as: 'user_permissions_access',
                            attributes: ['can_create', 'can_read', 'can_update', 'can_delete'],
                            where: { usuario_id: id } // Filtra para o usuário específico
                        }
                    ]
                },
                {
                    model: amalfisCli.Clientes_usuarios,
                    as: 'usuario_clientes',
                    attributes: ['codcli', 'nome', 'cnpj'],
                },
                {
                    model: amalfisCli.Colecao_usuarios,
                    as: 'usuario_colecoes',
                    attributes: ['codigo', 'descricao'],
                }
            ]
        });
    
        if (usuario === null) {
            console.log('Registro não encontrado na base de dados');
            return { status: false, usuario: null };
        }
    
        // Agrupa as permissões por tela usando UserPermissionAccess
        const permissoesPorTela = usuario.usuario_permissoes.reduce((acc, permissao) => {
            const telaNome = permissao.nome; // Usando o nome da permissão como representação da tela
    
            if (!acc[telaNome]) {
                acc[telaNome] = {
                    tela: telaNome,
                    permissoes: []
                };
            }
    
            // Extraindo permissões CRUD de `user_permissions_access`
            const crudPermissions = permissao.user_permissions_access[0]; // Obtém a entrada CRUD específica
            acc[telaNome].permissoes.push({
                permissao_id: permissao.id,
                can_create: crudPermissions?.can_create || false,
                can_read: crudPermissions?.can_read || false,
                can_update: crudPermissions?.can_update || false,
                can_delete: crudPermissions?.can_delete || false
            });
    
            return acc;
        }, {});
    
        // Organiza a resposta final com o usuário e permissões agrupadas por tela
        return {
            status: true,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                contato: usuario.contato,
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt,
                usuario_roles: usuario.usuario_roles,
                usuario_clientes: usuario.usuario_clientes,
                usuario_colecoes: usuario.usuario_colecoes,
                usuario_permissoes_por_tela: Object.values(permissoesPorTela)
            }
        };
    }
    
    

    async pegaUsuarioPorEmail_Services(email){
        const retorno = await amalfisCli.Usuario.findOne({where: {email: email}})
        if(retorno === null){
            console.log('email não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }else{
            console.log('email foi encontrado na base de dados');
            return {status:true, retorno: retorno};
        }

    }

    async validaSenhaUsuario_Services(email, senha){
        const retorno = await amalfisCli.Usuario.findAll({
            attributes:['id','nome','email'],
            where: {email: email}
        });

        if(retorno === null){
            console.log('E-mail não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }

        const pwd = await amalfisCli.Usuario.findAll({
            attributes:['senha'],
            where: {email: email}
        });
        const senhaDB = pwd[0].dataValues.senha;
        const checkSenha = await bcrypt.compare(senha, senhaDB);
        if(!checkSenha) return {status:false, message:"usuario ou senha incorreto!"};

        try {
            const secret = process.env.SECRET_LOGIN;
            let token=''
            const TokenExpirationTime = '1d'
            if(checkSenha){
            token = jwt.sign({
                id: retorno[0].dataValues.id,
                nome: retorno[0].dataValues.nome,
                email: retorno[0].dataValues.email,
            },secret,{ expiresIn: TokenExpirationTime }
            )}

            return {message:"Autentiação realizada com sucesso",token, status:true}
        } catch (e) {
            console.log(e);
            return { status:false, error: e.message };
        }
    }

    async atualizaUsuario_Services(userId, data) {
        const transaction = await sequelizeAmalfisCli.transaction();
        try {
            // 1. Atualizar dados básicos do usuário
            await amalfisCli.Usuario.update(
                {
                    nome: data.nome,
                    email: data.email,
                    cargo: data.cargo,
                    empresa_id: data.empresa_id,
                },
                { where: { id: userId }, transaction }
            );
    
            // 2. Atualizar permissões CRUD
            if (data.permissoesCRUD) {
                // Verifique se `usuarios_permissoes` está importado diretamente do `models/index.js`
                await amalfisCli.usuarios_permissoes.destroy({ where: { usuario_id: userId }, transaction });
    
                await amalfisCli.usuarios_permissoes.bulkCreate(
                    data.permissoesCRUD.map((perm) => ({
                        usuario_id: userId,
                        permissao_id: perm.permissao_id,
                        can_create: perm.can_create,
                        can_read: perm.can_read,
                        can_update: perm.can_update,
                        can_delete: perm.can_delete,
                    })),
                    { transaction }
                );
            }
    
            // 3. Atualizar coleções
            if (data.colecao) {
                await amalfisCli.Colecao_usuarios.destroy({ where: { usuario_id: userId }, transaction });
    
                await amalfisCli.Colecao_usuarios.bulkCreate(
                    data.colecao.map((colecao) => ({
                        usuario_id: userId,
                        colecao_id: colecao.id,
                    })),
                    { transaction }
                );
            }
    
            // 4. Atualizar clientes
            if (data.clientes) {
                await amalfisCli.Clientes_usuarios.destroy({ where: { usuario_id: userId }, transaction });
    
                await amalfisCli.Clientes_usuarios.bulkCreate(
                    data.clientes.map((cliente) => ({
                        usuario_id: userId,
                        cliente_id: cliente.id,
                    })),
                    { transaction }
                );
            }
    
            // Commit da transação
            await transaction.commit();
            return { status: true };
        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao atualizar usuário:', error);
            return { status: false, message: 'Erro ao atualizar usuário' };
        }
    }
    
    

    async cadastraUsuario_Services(bodyReq, permissoesCRUD) {
        const transaction = await sequelizeAmalfisCli.transaction(); // Inicia a transação
    
        try {
            // Valida se os role_id são UUIDs válidos
            if (!bodyReq.roles_id.every(id => isUuid(id))) {
                return { status: false, message: 'Informe um cargo válido.' };
            }
    
            // Valida se os permissao_id são UUIDs válidos
            if (!bodyReq.permissoes_id.every(id => isUuid(id))) {
                return { status: false, message: 'Informe uma permissão válida.' };
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
    
            // Verifica se o empresa_id é válido e se existe no banco de dados
            if (!isUuid(bodyReq.empresa_id)) {
                return { status: false, message: 'Informe uma empresa válida.' };
            }
    
            const empresa = await amalfisCli.Empresa.findByPk(bodyReq.empresa_id, { transaction });
    
            if (!empresa) {
                return { status: false, message: 'Empresa não encontrada.' };
            }
    
            // Cria o usuário dentro da transação
            const usuario = await amalfisCli.Usuario.create({ id: uuid.v4(), ...bodyReq }, { transaction });
    
            if (usuario === null) {
                console.log('usuário não cadastrado');
                await transaction.rollback(); // Faz o rollback caso o usuário não seja criado
                return { status: false };
            }
    
            // Adiciona roles ao usuário
            await usuario.addUsuario_roles(bodyReq.roles_id, { transaction });
    
            // Adiciona permissões ao usuário
            await usuario.addUsuario_permissoes(bodyReq.permissoes_id, { transaction });
    
            // Adiciona as permissões CRUD ao usuário
            if (permissoesCRUD && permissoesCRUD.length) {
                for (const permissao of permissoesCRUD) {
                    const { permissao_id, can_create, can_read, can_update, can_delete } = permissao;
    
                    await amalfisCli.UserPermissionAccess.create({
                        usuario_id: usuario.id,
                        permissao_id,
                        can_create,
                        can_read,
                        can_update,
                        can_delete
                    }, { transaction });
                }
            }
    
            // Cria coleções e as associa ao usuário
            if (bodyReq.colecao && Array.isArray(bodyReq.colecao)) {
                for (const colecao of bodyReq.colecao) {
                    const novaColecao = await amalfisCli.Colecao_usuarios.create({
                        usuario_id: usuario.id, // Adicionando a referência do usuário criado
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
                        usuario_id: usuario.id, // Adicionando a referência do usuário criado
                        codcli: cliente.codcli,
                        nome: cliente.nome,
                        cnpj: cliente.cnpj,
                        rg: cliente.rg
                    }, { transaction });
                    await usuario.addUsuario_clientes(novoCliente.id, { transaction });
                }
            }
    
            // Vincula o usuário à empresa
            await amalfisCli.Usuario_Empresa.create({
                usuario_id: usuario.id,
                empresa_id: bodyReq.empresa_id
            }, { transaction });
    
            // Commit na transação se tudo deu certo
            await transaction.commit();
            console.log('usuário cadastrado com sucesso');
            return { status: true };
    
        } catch (e) {
            await transaction.rollback(); // Faz o rollback caso ocorra qualquer erro
            console.error('Erro na associação', e);
            return { status: false, message: 'Erro na associação', error: e.message };
        } finally {
            if (!transaction.finished) await transaction.rollback(); // Assegura que a transação seja finalizada
        }
    }

    async deletaUsuarioPorId_Services(id){
        return amalfisCli.Usuario.destroy({ where: { id: id } });
    }
}

module.exports = Usuario_Services