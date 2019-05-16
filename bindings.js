const fn = require('./functions');
const rules = require('./rules');

let bindings = {};


bindings.implementBinding = function (binding) {
    console.log('Start to create binding');
    let file = fn.readRmarkdown(binding);
    let lines = file.split('\n');
    //let lineInFile = fn.returnRequestedLine(file,line);
    //let plotFunction = fn.extractPlotFunction(lineInFile);
    //let type = rules.findType(lines);
    let codeLines = fn.extractCodeLines(lines);
    let code = fn.extractCode(lines,codeLines.start,codeLines.end);
    console.log(JSON.stringify(code ,null, '\t'));




};


bindings.implementBinding('./test/example_for_loop.Rmd');







