var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
    name:'ApiKairos',
    description: 'api do controle de ponto',
    script: 'C:\\apiKairos\\app.js'  
});
 
// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});
 
// Uninstall the service.
svc.uninstall();