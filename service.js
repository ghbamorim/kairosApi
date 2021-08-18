var Service = require('node-windows').Service;
 
var svc = new Service({
    name:'ApiKairos',
    description: 'api do controle de ponto',
    script: 'C:\\apiKairos\\app.js'
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();