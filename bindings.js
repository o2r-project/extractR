const fn = require('./functions');

let bindings = {};


bindings.implementBinding = function (binding,line) {
    console.log('Start to create binding');
    let file = fn.readRmarkdown(binding);
    let lineInFile = fn.returnRequestedLine(file,line);
    let plotFunction = fn.extractPlotFunction(lineInFile);

};


bindings.implementBinding('./examples/Development of a new gas-flaring emission dataset for southern/workspace/main.Rmd',0);




