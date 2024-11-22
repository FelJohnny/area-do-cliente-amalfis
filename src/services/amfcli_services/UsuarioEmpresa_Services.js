const { amalfisCli } = require('../../models/index.js');

class UsuarioEmpresa_Services {

    // Serviço para buscar todos os usuários de uma empresa
    async pegaUsuariosPorEmpresaId_Services(empresaId) {
        const usuarios = await amalfisCli.Usuario.findAll({
            include: [{
                model: amalfisCli.Empresa,
                as: 'empresas',
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

    // Serviço para adicionar um usuário a uma empresa
    async adicionaUsuarioEmpresa_Services(empresaId, usuarioId) {
        const usuarioEmpresaExistente = await amalfisCli.Usuario_Empresa.findOne({
        where: { usuario_id: usuarioId, empresa_id: empresaId }
        });
    
        if (usuarioEmpresaExistente) {
        return { error: true, message: 'Usuário já vinculado a esta empresa' };
        }
    
        const novoVinculo = await amalfisCli.Usuario_Empresa.create({
        usuario_id: usuarioId,
        empresa_id: empresaId
        });
    
        return novoVinculo;
  }

  async pegaUsuariosDisponiveis_Services() {
    const usuarios = await amalfisCli.Usuario.findAll({
        include: [{
            model: amalfisCli.Empresa,
            as: 'empresas',
            required: false,
            where: { id: null }  // Somente usuários que não estão vinculados a nenhuma empresa
        }]
    });
    return usuarios;
}
  
}

module.exports = UsuarioEmpresa_Services;
