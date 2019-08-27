const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('extractR');
const path = require('path');
const fn = require('./functions');
const rules = require('./rules');
const processJson = require('./processJson');


let extractR = {};

extractR.start = (conf) => {
    return new Promise((resolve, reject) => {
        const app = express();
              app.use(bodyParser.json());
              app.use(bodyParser.urlencoded({extended: true}));
        
        debug('Start service to create bindings');

        //Create post for plot functions, response as binding.plotFunctions as array
        
        app.post('/api/v1/bindings/extractR', function(req, res) {
            extractR.implementExtractR(req.body, res);
        });
    
        let extractRListen = app.listen(conf.port, () => {
            debug('Bindings server listening on port %s', conf.port);
            console.log('Server running on ' + conf.port)
            resolve(extractRListen);
        });
    });
};

//Remember plot functions
extractR.implementExtractR = function (binding,response) {
    console.log('Start to create binding');
    console.log(binding);

    //Used for testing
    let file = fn.readFile('test',binding);

    //Comment in if used with Service
    //let file = fn.readRmarkdown(binding.id, binding.sourcecode.file);

    //let file = fn.readFile(binding.id, binding.sourcecode.file);
    
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
    let varsInLines = processJson.getVarsAndValuesOfLines(processedJson);
    //console.log('PROCESSED ' + JSON.stringify(processedJson,null,2));

    
    //Mock response TODO --> REPLACE CODED LINES
    // Codelines = {"start":30,"end":424} 
    /** 
    binding.sourcecode.codelines = processJson.getCodeLines(processedJson);
    console.log(binding.sourcecode.codelines)
    response.send({
        callback: 'ok',
        data: binding});
    */    
    //let plotFun = processJson.findPlotLines(jsonObj, plotFunctions);
    //console.log('TADAAA ' + JSON.stringify(processedJson));
};

//extractR.implementExtractR('./test/example_if.Rmd');
//extractR.implementExtractR('./examples/Aquestiondrivenprocess/workspace/main.Rmd');
extractR.implementExtractR('./tmp/INSYDE a synthetic, probabilistic flood damage model based on/workspace/main.Rmd')


module.exports = extractR;



