const path = require("path");
var puppeteer;
if (process.pkg) {
  puppeteer = require(path.resolve(process.cwd(), './node_modules/puppeteer'));
} else {
  puppeteer = require('puppeteer');
}



const fs = require("fs")
const TableToJson = require("./tableToJson")


const urlReportKairos = "https://www.dimepkairos.com.br/Dimep/Relatorios/PontoFuncionario";
const urlReportBancoDeHoras = "https://www.dimepkairos.com.br/Dimep/Relatorios/ExtratoBancoHoras";

class KairosDownload {
  constructor(opcoes) {    
    this.usuario = opcoes.usuario;
    this.senha = opcoes.senha;
    this.periodo_inicial = opcoes.periodo_inicial;
    this.periodo_final = opcoes.periodo_final;
    this.headless = !opcoes.exibeNavegador;
    this.debug = opcoes.debug;
  }

  salva_log(lista_msg) {    
    let caminho = process.cwd() + '/logs_erros';
    if (!fs.existsSync(caminho)) {
      fs.mkdirSync(caminho);
    }    
    let s = new Date().toString().replace(/[()]/g, "");    
    s = this.usuario = s.replace(/:/g, "-");        
    s = this.usuario = s.replace(/ /g, "-");    
    let arquivo = caminho + '/logs_' + s + '.txt';   
    fs.appendFileSync(arquivo, lista_msg);    
  }

  async getJson() {
    let processando ="";
    try {            
      const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      this.page = await browser.newPage();
      processando = "await this.realiza_login_redmine();"
      await this.realiza_login_redmine();      
      let opcoes = {
        tipo : 1,
        botaogerar: "bt_gerar_ponto",
        cabecalho : "infosCabecalho"
      }
      processando = "let ponto = await this.gera_relatorio(opcoes)"
      let ponto = await this.gera_relatorio(opcoes)
      await this.page.goto(urlReportBancoDeHoras, { waitUntil: 'networkidle2' });          
      opcoes = {
        tipo : 2,
        botaogerar: "bt_gerar_extrato_banco_horas",
        cabecalho : "infoEmp"        
      }      
      processando = "let banco = await this.gera_relatorio(opcoes)"      
      let banco = await this.gera_relatorio(opcoes)
      await browser.close();            
      return {
        ponto : ponto,
        horas : banco
      };
    } catch (e) {
      this.prosalva_log(e + "no método "+processando)
      throw e;
    }
  }; 

  async realiza_login_redmine() {
    await this.page.goto(urlReportKairos, { waitUntil: 'networkidle2' });
    await this.page.click('input[id="LogOnModel_UserName"]');
    await this.page.keyboard.type(this.usuario);
    await this.page.click('input[id="LogOnModel_Password"]');
    await this.page.keyboard.type(this.senha);
    await this.page.click('.btn.btn-success');
  }

  async gera_relatorio(opcoes) {    
    let botao;
    if (opcoes.tipo === 1){
      try
      {
        botao = await this.page.waitFor("//div[@aria-label='Fechar diálogo']", {timeout: 60000});
        await botao.click()
      }
      catch (e)
      {
        console.log('elemento provavelmente não existe');
      }
    }

    await this.page.waitFor("input[id='data_de']");    
    
    async function loopDataIni(){           
      await this.page.focus("input[id='data_de']")      
      await this.page.evaluate(() => document.getElementById("data_de").value = "")
      await this.page.keyboard.type(this.periodo_inicial);
      let element = await this.page.$("input[id='data_de']");     
      let text = await (await element.getProperty('value')).jsonValue();
            
      if (text !== this.periodo_inicial){
        return await loopDataIni.call(this)
      } else {
        return
      }
    }
 
    await loopDataIni.call(this)
    
    async function loopDataFim(){           
      await this.page.focus("input[id='data_ate']")      
      await this.page.evaluate(() => document.getElementById("data_ate").value = "")
      await this.page.keyboard.type(this.periodo_final);
      let element = await this.page.$("input[id='data_ate']");     
      let text = await (await element.getProperty('value')).jsonValue();
            
      if (text !== this.periodo_final){
        return await loopDataFim.call(this)
      } else {
        return
      }
    }    

    await loopDataFim.call(this) 

    botao = await this.page.waitFor("//span[@id='toogleSelectionType']");
    await botao.click()

    botao = await this.page.waitFor("//div[@id='checkAllPages']");
    await botao.click()

    botao = 
       await this.page.waitFor(
         "//input[@id='"+opcoes.botaogerar+"']", 
         {timeout: 60000} 
        );
    await botao.click()
    
    try
    {
      await this.page.waitFor(
        "//div[@class='"+opcoes.cabecalho+"']", 
        {timeout: 180000} 
      );
      
      let tabela = await this.page.evaluate(el => el.innerHTML, await this.page.$('#template'));    
        if (this.debug){
          fs.writeFileSync(opcoes.cabecalho + ".html", tabela)
        }
        let tj = new TableToJson();
        if (opcoes.tipo === 1){
          return await tj.processaPonto(tabela);   
        } else {
          return await tj.processaBanco(tabela);         
        }
    }
    catch (e)
    {
      console.log('elemento provavelmente não existe');
      const emptyArray = []
      if (opcoes.tipo === 1){
        return emptyArray;   
      } else {
        return emptyArray;         
      }
    }

    
  }
}

module.exports = KairosDownload