class Controller {
  constructor(nomeModel, campos) {
    this.nomeModel = nomeModel;
    this.camposObrigatorios = campos;
    this.camposVazios = [];
  }

   async allowNull(req, res) {
    this.camposVazios = [] //serve para nao acumular valores duplicados na array
    const todosCamposTrue = this.camposObrigatorios.every((campo) => {

      if (req.body[campo] == null) {
        this.camposVazios.push(campo)
      }
      
      return req.body[campo];
    });
    
    if (todosCamposTrue){
      return { status: true };
    } 
    else{
      return { status: false, campos: this.camposVazios };
    } 
  }
  //-------------------------------------READ-------------------------------------//
  
}

module.exports = Controller;