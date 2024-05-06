class Controller {
  constructor(propsServices, campos) {
    this.propsServices = propsServices;
  }

  //-------------------------------------READ-------------------------------------//

  async pegaTodosController(req, res) {
    try {
      const listaDeRegistro = await this.propsServices.pegaTodosRegistros();
      return res.status(200).json(listaDeRegistro);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro: ${e}` });
    }
  }

  //-------------------------------------READ-POR-ID-------------------------------------//

  async pegaUmRegistroPorIdController(req, res) {
    const { numero } = req.params;
    try {
      
      const umRegistro = await this.propsServices.pegaRegistroPorDado(numero);
      if(umRegistro == null){
        return res.status(400).json({message:`não foi possivel encontrar o registro: ${numero}`,resposta:umRegistro});
      }else{
        return res.status(200).json(umRegistro);
      }
    } catch (erro){
      return res.status(500).json({ message: `erro ao buscar registro, mensagem do erro: ${erro}` });
    }
  }
}

module.exports = Controller;
