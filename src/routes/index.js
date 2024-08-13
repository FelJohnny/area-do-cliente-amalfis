const express = require('express');
const cors = require('cors');
const pedido3_001_Routes = require('./pedido3_001_Routes.js');
const pedido_001_Routes = require('./pedido_001_Routes.js');
const auth_Routes = require('./auth_Routes.js')
const role = require('./cli_role._Routes.js')


module.exports = (app)=>{
    app.use(cors());
    app.use(express.json());
    app.use(pedido3_001_Routes);
    app.use(pedido_001_Routes);
    app.use(auth_Routes);
    app.use(role);
}