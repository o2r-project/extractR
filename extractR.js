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

extractR.implementExtractR = function (binding,response) {
    console.log('Start to create binding');
    console.log(binding);

    //Used for testing
    let file = fn.readFile('test',binding);

    //Comment in if used with Service
    //let file = fn.readRmarkdown(binding.id, binding.file);

    //let file = fn.readFile(binding.id, binding.file);
    
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
    let codeparts = fn.splitCodeIntoLines(code,codeLines.start[0]);
   // console.log(codeparts);
    let type = rules.getTypeOfLine(codeparts);
    let comments = fn.deleteComments(type);
    let json = fn.array2Json(comments);
    //console.log(json);
    let jsonObj = {'Lines': json};
    let processedJson = processJson.addFileContentToJson(jsonObj);
    console.log('PROCESSED ' + JSON.stringify(processedJson,null,2));
    let varsInLines = processJson.getVarsAndValuesOfLines(processedJson);
    //console.log('varsInLines');
    //console.log(varsInLines);
    //Insert binding.plot
    let valuesToSearchFor = processJson.valuesToSearchFor('PlotFigure1(Tracks.df,vals)');
    //let valuesToSearchFor = processJson.valuesToSearchFor('PlotFigure2b(fullData.sdf,r)');
    let codeLinesForValues = processJson.getAllCodeLines(varsInLines,valuesToSearchFor,[],[]);
    console.log('FCL');
    console.log(codeLinesForValues);
    //let finalCodeLines = processJson.getCodeLines(codeLinesForValues);
    //console.log('FC')
    //console.log(finalCodeLines);
    //console.log('PROCESSED ' + JSON.stringify(processedJson,null,2));
    //console.log('LINE7');
    //console.log(lines);
    //console.log(lines.length);

    
    //Mock response TODO --> REPLACE CODED LINES
    // Codelines = {"start":30,"end":424} 
    /** 
     * TODO: How to get var to search for?
    binding.codelines = processJson.getCodeLines(codeLinesForValues);
    console.log(binding.codelines)
    response.send({
        callback: 'ok',
        data: binding});
    */    

};

//extractR.implementExtractR('./test/example_if.Rmd');
//extractR.implementExtractR('./tmp/Aquestiondrivenprocess/main.Rmd');
//extractR.implementExtractR('./tmp/INSYDE a synthetic, probabilistic flood damage model based on/workspace/main.Rmd')
extractR.implementExtractR('./tmp/main.Rmd')


module.exports = extractR;



