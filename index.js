// docker: docker-machine create -d virtualbox --virtualbox-cpu-count=2 --virtualbox-memory=4096 --virtualbox-disk-size=50000 default
const config = require('./config/config');
let extractR = require('./extractR');

extractR.start({
  port: config.net.port
});