const fn = require('./functions');
const rules = require('./rules');
const processJson = require('./processJson');

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
    //console.log('Code: ');
    //console.log(JSON.stringify(code ,null, '\t'));
    //console.log(JSON.stringify(code[code.length-1] ,null, '\t'));
    //console.log('Codeparts: ');
    //console.log(codeLines);
    let codeparts = fn.splitCodeIntoLines(code);
   // console.log(codeparts);
    let type = rules.getTypeOfLine(codeparts);
    let comments = fn.deleteComments(type);
    let json = fn.array2Json(comments);
    //console.log(json);
    let jsonObj = {'Lines': json};
    let processedJson = processJson.addFileContentToJson(jsonObj);
    console.log(JSON.stringify(processedJson));
};

//bindings.implementBinding('./test/example_library.Rmd');
//bindings.implementBinding('./test/example_if.Rmd');
//bindings.implementBinding('./test/example_repeat_loop.Rmd');
bindings.implementBinding('./test/example_for_loop.Rmd');
//bindings.implementBinding('./test/example_inline_function.Rmd');
//bindings.implementBinding('./examples/Aquestiondrivenprocess/workspace/main.Rmd');






