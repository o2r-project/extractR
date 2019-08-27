const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const debug = require('debug')('extractR');
const rules = require('./rules');

let fn = {};

fn.readRmarkdown = function(compendiumId, mainfile) {
    debug('Start reading RMarkdown %s from compendium %s', mainfile, compendiumId);
    if ( !compendiumId | !mainfile ) {
        throw new Error('File does not exist.');
    }
    let paper = path.join('tmp', 'o2r', 'compendium', compendiumId, mainfile);
    fs.exists(paper, function(ex) {
        if (!ex) {
            debug('Cannot open file %s', paper);
            throw new Error('File does not exist.');
        }
    });
    debug('End reading RMarkdown');
    return fs.readFileSync(paper, 'utf8');
};

fn.readFile = function (compendiumId,mainFile) {
    if (!mainFile){
        throw new Error('File does not exist.');
    }

    let paper = mainFile;

    fs.exists(paper, (ex) => {
        if(!ex) {
            throw new Error('File does not exist.');
        }
    })
    let content = fs.readFileSync(paper,'utf8');
    return content
}

fn.returnRequestedLine = function (file,lineNumber) {
    let lines = file.split('\n');
    if (lineNumber + 1 > lines.length || lineNumber <= 0){
        throw new Error('The specified Line does not exist');
    } else {
        //console.log(lines[lineNumber-1]);
        return lines[lineNumber-1];
    }
};

fn.extractCodeLines = function (file) {
    let linesExp = new RegExp('```');
    let start = [];
    let end = [];
    let found = 0;
    for(let i= 0; i<file.length;i++){
        if (linesExp.test(file[i])){
            if(found % 2 === 0){
                start.push(i+1);
                found++;
            } else {
                end.push(i);
                found++;
            }
    }
    }
    return {
        start: start,
        end: end
    };
};

fn.extractCode = function(file,start,end){
   let code = [];
   for(let i = 0; i < start.length;i++){
      let codeparts = file.slice(start[i],end[i]);
      code.push(codeparts);
   }
   // Replace \r through ''
   for(let i = 0; i<code.length;i++) {
       code[i] = code[i].map((x) => x.replace('\r', ''));
   }
   return code;
};

/**
 *
 * @param code
 * @returns {Array} including the codeline, the block and the line number of that specific block
 */
fn.splitCodeIntoLines = function (code) {
    let codeLines = [];
    let commentOnly = /^\s*#.*/;
    let counter = 0;

    for (let i = 0;i<code.length;i++) {
        for (let j = 0;j<code[i].length; j++) {
            if (code[i][j].length > 0){
                let noComment = commentOnly.test(code[i][j])
                if(noComment == false){ 
                    let value = code[i][j]
                    codeLines.push({"value":value,"codeBlock": i, "Line": counter});
                    counter++;
                }
            }
        }
    }
    //console.log('CL ' + JSON.stringify(codeLines))
    return codeLines;
};


fn.filterComments = function (code) {
    let comments = [];
    let commentExpression = /#(.*)/g;

    for (let i = 0;i<code.length;i++) {
            if (commentExpression.test(code[i].value)) {
                //console.log(code[i].value.match(commentExpression)[0]);
                comments.push({
                    'value':code[i].value.match(commentExpression)[0],
                    'find':{"codeBlock": code[i].codeBlock, "Line": code[i].Line}
                })
            }
        }
    return comments;
};

fn.deleteComments = function (code) {
    let commentExpression = /#(.*)/g;
    for(let i = 0; i<code.length;i++) {
            if (commentExpression.test(code[i].value)) {
                let comment = code[i].value.match(commentExpression)[0];
                code[i].value = code[i].value.replace(comment,'');
            }
        }
    return code;
};

fn.array2Json = function (array) {
  let jsonString = JSON.stringify(array);
  let jsonObject = JSON.parse(jsonString);
  return jsonObject;
};

module.exports = fn;