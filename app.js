const Controller = require("./controller")
const BodyParser = require('body-parser');
const Express = require('express');

class Api {
  constructor() {
    this.app = Express();
    let caminho = process.cwd() + '/config.ini';
    let ini = fs.readFileSync(caminho, 'utf8');
    let linhas = ini.split(/\r?\n/);
    let porta = linhas[0].replace("porta=", "");
    this.port = process.env.PORT || porta;

    this.app.use(Express.static('public'));

    this.app.use(BodyParser.urlencoded({ extended: true }));
    this.app.use(BodyParser.json());

    this.app.route('/').post(
      async (req, res) => {
        res.send('index.html')
      });

    this.app.route('/add').post(
      async (req, res) => {
        let opcoes = req.body;        
        let id = await Controller.getInstance().add(opcoes);
        res.json({ id: id })
      });

    this.app.route('/getstatus').get(
      async (req, res) => {
        let id = req.query.id;
        let status = await Controller.getInstance().getStatus(id);
        res.json(status)
      });

    this.app.route('/getresult').get(
      async (req, res) => {
        let id = req.query.id;
        let status = await Controller.getInstance().getResult(id);
        res.json(status)
      });
  }

  async init() {
    this.app.listen(this.port, () => console.log('Servidor utilizando a porta : ' + this.port)
    );

  }
}

let c = new Api()
  c.init()