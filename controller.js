const KairosDownload = require("./kairos");

var Status = {
  Pendente: 0,
  Processando: 1,   
  ProntoParaEntrega: 2,
  Erro: 3,
  Engregue : 4  
};

let instance = null;
class Controller {
    newId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    constructor() {
        this.solicitacoes = []
    }
    static getInstance() {
        if (instance === null) {
            instance = new Controller();
        }
        return instance;
    }

    async getStatus(id){
      this.solicitacoes = this.solicitacoes.filter((e) => e.status !== Status.Engregue);      
      let encontrado = this.solicitacoes.filter(
        (e) => (
          e.id ===id
        )
      );
      if (encontrado.length > 0){
        return {status: encontrado[0].status};
      } else {
        return {status: Status.Engregue};
      }      
    }

    getResult(id){
      let encontrado = this.solicitacoes.filter(
        (e) => (
          e.id ===id && 
          (e.status === Status.ProntoParaEntrega || 
            e.status === Status.Erro)
        )
      );
      if (encontrado.length > 0){
        encontrado[0].status = Status.Engregue;
        return encontrado[0].result;
      } else {
        return {Status: "Não processado"};
      }            
    }

    processaProximo() {
        this.solicitacoes = this.solicitacoes.filter((e) => e.status !== Status.Engregue);
        let executando = this.solicitacoes.filter((e) => e.status === Status.Processando);
        if (executando.length > 0) {
            return;
        }        
        for (const solicitacao of this.solicitacoes) {
            if (solicitacao.status === 0) {
                solicitacao.status = Status.Processando;
                solicitacao.kairosDownload.getJson().then(
                    (data) => {
                        solicitacao.result = data;                        
                        solicitacao.status = Status.ProntoParaEntrega;
                        this.processaProximo()
                    },
                    (err) => {
                      solicitacao.result = {erro : err};
                      console.log(err);
                      solicitacao.status = Status.Erro; 
                      this.processaProximo()                      
                    }                    
                );
                return
            }
        }
    }

    async add(parametros) {
        let solicitacao = {
            id: this.newId(),
            kairosDownload: new KairosDownload(parametros),
            status: Status.Pendente
        }
        this.solicitacoes.push(solicitacao);
        this.processaProximo();
        return solicitacao.id;
    }
}

module.exports = Controller
