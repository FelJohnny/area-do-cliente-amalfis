const { amalfisCli } = require('../../models/index.js');

class UsuarioEmpresa_Services {

    // Serviço para buscar todos os usuários de uma empresa
    async pegaUsuariosPorEmpresaId_Services(empresaId) {
        const usuarios = await amalfisCli.Usuario.findAll({
            include: [{
                model: amalfisCli.Empresa,
                as: 'usuario_empresas',
                where: { id: empresaId }
            }]
        });
        return usuarios;
    }

    // Serviço para atualizar o relacionamento de um usuário e empresa
    async atualizaUsuarioEmpresa_Services(empresaId, usuarioId, dadosAtualizados) {
        const usuarioEmpresa = await amalfisCli.Usuario_Empresa.findOne({
            where: { usuario_id: usuarioId, empresa_id: empresaId }
        });

        if (!usuarioEmpresa) {
            return null;
        }

        await usuarioEmpresa.update(dadosAtualizados);
        return usuarioEmpresa;
    }

    // Serviço para excluir um usuário de uma empresa
    async deletaUsuarioEmpresa_Services(empresaId, usuarioId) {
        const usuarioExcluido = await amalfisCli.Usuario_Empresa.destroy({
            where: { usuario_id: usuarioId, empresa_id: empresaId }
        });

        return usuarioExcluido;
    }
}

module.exports = UsuarioEmpresa_Services;
