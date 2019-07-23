var env = process.env;
var c = {};
    c.net={};
    c.net.port = env.EXTRACTR_PORT || 8092;

module.exports = c;