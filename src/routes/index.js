const express = require('express');
const cors = require('cors');
const pedido3_001_Routes = require('./sisplan_routes/pedido3_001_Routes.js');
const pedido_001_Routes = require('./sisplan_routes/pedido_001_Routes.js');
const auth_Routes = require('./sisplan_routes/auth_Routes.js')
const contato_001_Routes = require('./sisplan_routes/contato_001_Routes.js')
const grupo_cli_001_Routes = require('./sisplan_routes/grupo_cli_001_Routes.js')
const colecao_001_Routes = require('./sisplan_routes/colecao_001_Routes.js')
const entidade_001_Routes = require('./sisplan_routes/entidade_001_Routes.js')
const role_Routes = require('./amfcli_routes/role_Routes.js')
const permissao_Routes = require('./amfcli_routes/permissao_Routes.js')
const seguranca_Routes = require('./amfcli_routes/seguranca_Routes.js')
const usuario_Routes = require('./amfcli_routes/usuario_Routes.js')
const clientes_usuarios_Routes = require('./amfcli_routes/clientes_usuarios_Routes.js')

// Importação das novas rotas
const empresas_Routes = require('./amfcli_routes/empresas_Routes.js');
const usuario_empresa_Routes = require('./amfcli_routes/usuario_empresa_Routes.js');

module.exports = (app) => {
    app.use(cors());
    app.use(express.json());

    // sisplan
    app.use(usuario_Routes);
    app.use(pedido3_001_Routes);
    app.use(pedido_001_Routes);
    app.use(auth_Routes);
    app.use(contato_001_Routes);
    app.use(entidade_001_Routes);
    
    // amalfis-cli
    app.use(role_Routes);
    app.use(permissao_Routes);
    app.use(seguranca_Routes);
    app.use(grupo_cli_001_Routes);
    app.use(colecao_001_Routes);
    app.use(clientes_usuarios_Routes);
    
    // Novas rotas para empresas e associação usuário-empresa
    app.use(empresas_Routes);
    app.use(usuario_empresa_Routes);
};
