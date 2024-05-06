const model = require('../models')

class Services{
        constructor(nomeModel){
            this.nomeModel = nomeModel;
        }

    //-----------READ--------------//
    async pegaTodosRegistros(){
        return model[this.nomeModel].findAll();
    }

    async pegaUmRegistroPorId(id) {
        return model[this.nomeModel].findByPk(id);
    }

    async pegaRegistroPorDado(dado){
        const retorno = await model[this.nomeModel].findAll({
            attributes:['numero', 'codigo', 'tam', 'cor','caixa', 'qtde', 'qtde_f', 'deposito'],
            where: {numero: dado}
        })
        if(retorno === null){
            console.log('registro não encontrado na base de dados');
            return {status:false, retorno: retorno};
        }else{
            //dado
            console.log('registro foi encontrado na base de dados');
            return {status:true, retorno: retorno};

        }
    }
}


module.exports = Services