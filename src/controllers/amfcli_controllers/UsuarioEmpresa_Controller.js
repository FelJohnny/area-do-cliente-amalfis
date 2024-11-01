const UsuarioEmpresa_Services = require('../../services/amfcli_services/UsuarioEmpresa_Services')

const usuario_empresa_services = new UsuarioEmpresa_Services();

class UsuarioEmpresa_Controller {

    // Método para buscar usuários por empresa ID
    async pegaUsuariosPorEmpresaId_Controller(req, res) {
        const { empresaId } = req.params;
        try {
            const usuarios = await usuario_empresa_services.pegaUsuariosPorEmpresaId_Services(empresaId);
            if (!usuarios || usuarios.length === 0) {
                return res.status(404).json({ message: 'Nenhum usuário encontrado para esta empresa.' });
            }
            return res.status(200).json(usuarios);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Erro ao buscar usuários da empresa, contate o administrador do sistema.' });
        }
    }

    // Método para atualizar o relacionamento de um usuário e empresa
    async atualizaUsuarioEmpresa_Controller(req, res) {
        const { empresaId, usuarioId } = req.params;
        const dadosAtualizados = req.body;
        try {
            const usuarioAtualizado = await usuario_empresa_services.atualizaUsuarioEmpresa_Services(empresaId, usuarioId, dadosAtualizados);
            if (!usuarioAtualizado) {
                return res.status(404).json({ message: `Usuário com o ID ${usuarioId} na empresa ${empresaId} não encontrado.` });
            }
            return res.status(200).json({ message: 'Usuário atualizado com sucesso.', usuarioAtualizado });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Erro ao atualizar o usuário da empresa, contate o administrador do sistema.' });
        }
    }

    // Método para excluir um usuário de uma empresa
    async deletaUsuarioEmpresa_Controller(req, res) {
        const { empresaId, usuarioId } = req.params;
        try {
            const usuarioExcluido = await usuario_empresa_services.deletaUsuarioEmpresa_Services(empresaId, usuarioId);
            if (!usuarioExcluido) {
                return res.status(404).json({ message: `Usuário com o ID ${usuarioId} não encontrado na empresa ${empresaId}.` });
            }
            return res.status(200).json({ message: `Usuário com o ID ${usuarioId} foi removido da empresa ${empresaId}.` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Erro ao excluir o usuário da empresa, contate o administrador do sistema.' });
        }
    }
}

module.exports = UsuarioEmpresa_Controller;
