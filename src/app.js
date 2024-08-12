const express = require('express');
const { sequelizeSisplan, sequelizeAmalfisCli } = require('./config/config.js');
const routes = require('./routes/index.js');
const app = express();

routes(app);

// Autenticação do banco de dados Sisplan
sequelizeSisplan.authenticate()
    .then(() => {
        console.log('Conexão com o SISPLAN estabelecida com sucesso');
    })
    .catch((err) => {
        console.error('Não foi possível se conectar com o SISPLAN', err);
    });

// Autenticação do banco de dados AmalfisCli
sequelizeAmalfisCli.authenticate()
    .then(() => {
        console.log('Conexão com o AMALFIS-CLI estabelecida com sucesso');
    })
    .catch((err) => {
        console.error('Não foi possível se conectar com o AMALFIS-CLI', err);
    });

module.exports = app;
