const config = require('./config/config');
let bindings = require('./bindings');

bindings.start({
  port: config.net.port
});