const config = require('./config/config');
let extractR = require('./extractR');

extractR.start({
  port: config.net.port
});