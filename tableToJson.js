fs = require('fs')
const cheerio = require('cheerio');

class TableToJson {
  async processaPonto(table){    
    const $ = cheerio.load(table);    
    let retorno = {
      usuarios: []
    }
    let infoFuncionarios = $('[data-bind="with: InfoFuncionario"]');
    infoFuncionarios.each((index, func) => {
      let table = $(func).closest("table");  
      let tbl_ponto = $(table).next(".tbl_ponto");
      let tbl_rodape = $(tbl_ponto).next(".tbl_ponto");
      let tbl_resumo = $(tbl_rodape).next("table");
      let tbl_ponto_marcacoes = $(tbl_ponto).find("tbody[data-bind='foreach: Entradas']")
      let trs = $(tbl_ponto_marcacoes).find("tr");
    
      let marcacoes = [];
    
      trs.each(
        (index, tr) => { 
          marcacoes.push({
            Data : $(tr).find("[data-bind='text: Data']").text(),  
            Horario : $(tr).find("[data-bind='text: Horario']").text(),  
            Apontamentos : $(tr).find("[data-bind='html: Apontamentos']").text(),  
            HTrab : $(tr).find("[data-bind='text: HTrab']").text(),  
            HE : $(tr).find("[data-bind='text: HE']").text(),          
            ADN : $(tr).find("[data-bind='text: ADN']").text(),                          
            ADNHE : $(tr).find("[data-bind='text: ADNHE']").text(),          
            CPonte : $(tr).find("[data-bind='text: CPonte']").text(),          
            Descontos : $(tr).find("[data-bind='text: Descontos']").text(),  
            Debito : $(tr).find("[data-bind='text: Debito']").text(),                  
            Credito : $(tr).find("[data-bind='text: Credito']").text(),          
            Justificativa : $(tr).find("[data-bind='text: Justificativa']").text(),          
          })
        }
      );
       
      let totais = $(tbl_ponto).find("tbody").eq(1);
    
      let rodape = $(tbl_rodape).find("tbody");
    
      let resumo = $(tbl_resumo).find("tbody");
    
    
      retorno.usuarios.push({
        Nome: $(func).find("span[data-bind='text: Nome']").text(),
        Matricula: $(func).find("span[data-bind='text: Matricula']").text(),
        Cargo: $(func).find("span[data-bind='text: Cargo']").text(),
        PIS: $(func).find("span[data-bind='text: PIS']").text(),
        DataAdmissao: $(func).find("span[data-bind='text: DataAdmissao']").text(),
        Estrutura: $(func).find("span[data-bind='text: Estrutura']").text(),
        CarteiraTrabalho: $(func).find("span[data-bind='text: CarteiraTrabalho']").text(),
        BaseHoras: $(func).find("span[data-bind='text: BaseHoras']").text(),
        
        TotalHorasTrabalhadas: $(totais).find("td[data-bind='text: TotalHorasTrabalhadas']").text(),
        TotalHorasExtraordinarias: $(totais).find("td[data-bind='text: TotalHorasExtraordinarias']").text(),    
        TotalADN: $(totais).find("td[data-bind='text: TotalADN']").text(),    
        TotalADNHE: $(totais).find("td[data-bind='text: TotalADNHE']").text(),    
        TotalCompPonte: $(totais).find("td[data-bind='text: TotalCompPonte']").text(),    
        TotalDebito: $(totais).find("td[data-bind='text: TotalDebito']").text(),    
        TotalCredito: $(totais).find("td[data-bind='text: TotalCredito']").text(),    
    
        SaldoAnterior: $(rodape).find("td[data-bind='text: SaldoAnterior']").text(),        
        SaldoPeriodo: $(rodape).find("td[data-bind='text: SaldoPeriodo']").text(),            
        SaldoAtual: $(rodape).find("td[data-bind='text: SaldoAtual']").text(),    
    
        DiasTrabalhados: $(resumo).find("span[data-bind='text: DiasTrabalhados']").text(),        
        Faltas: $(resumo).find("span[data-bind='text: Faltas']").text(),            
        DSRs: $(resumo).find("span[data-bind='text: DSRs']").text(),            
        Atrasos: $(resumo).find("span[data-bind='text: Atrasos']").text(),            
        HorasTrabalhadasFeriado: $(resumo).find("span[data-bind='text: HorasTrabalhadasFeriado']").text(),               
        HEIntervaloNaoClassificada: $(resumo).find("span[data-bind='text: EventoNaoClassificado']").text(),    
        Marcacoes : marcacoes
      })
    });    
    return retorno;    
  }


  async processaBanco(table){    
    const $ = cheerio.load(table);    
    let retorno = {
      usuarios: []
    }
    let div = $('div[data-bind="foreach: Funcionarios"]');    
    let infoFuncionarios = $(div).find('.infoEmp');
    
    infoFuncionarios.each((index, func) => {

      let grid = $(func).next("table[id='Grid']")

      let body = $(grid).find("tbody[data-bind='foreach: Entradas']")
  
      let trs = $(body).find("tr");
      let marcacoes = [];
      trs.each(
        (index, func) => { 
          marcacoes.push({
            Dia : $(func).find("td[data-bind='html: Dia']").text(),
            Horario : $(func).find("td[data-bind='html: Horario']").text(),          
            Apontamentos : $(func).find("td[data-bind='html: Apontamentos']").text(),          
            Historico : $(func).find("td[data-bind='html: Historico']").text(),          
            Debito : $(func).find("td[data-bind^='html: Debito']").text(),          
            CreditoReal : $(func).find("td[data-bind^='html: CreditoReal']").text(),          
            Credito : $(func).find("td[data-bind^='html: Credito']").text(),          
            SaldoAtual : $(func).find("td[data-bind^='html: SaldoAtual']").text(),          
          })
        }
      )
  
      retorno.usuarios.push({
        Nome: $(func).find("span[data-bind='text: Nome']").text(),
        Matricula: $(func).find("span[data-bind='text: Matricula']").text(),
        Estrutura: $(func).find("span[data-bind='text: Estrutura']").text(),      
        DataAtual: $(func).find("span[data-bind='text: $parent.DataAtual']").text(),              
        SaldoAnterior: $(func).find("span[data-bind='text: SaldoAnterior']").text(),              
        DataLimiteBancoHoras: $(func).find("span[data-bind='text: $parent.DataLimiteBancoHoras']").text(),              
        Marcacoes : marcacoes
      })
    });    
    return retorno;    
  }  
}

module.exports = TableToJson