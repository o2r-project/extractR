const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const rules = require('./rules');

let fn = {}

fn.readRmarkdown = function (file) {
    if (!file){
        throw new Error('File does not exist.');
    }

    let paper = file;

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
        console.log(lines[lineNumber-1]);
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
    //code = fn.deleteComments(code);

    for (let i = 0;i<code.length;i++) {
        for (let j = 0;j<code[i].length; j++) {
            if (code[i][j] != '') {
                codeLines.push([code[i][j], {"codeBlock: ": i, "Line: ": j}]);
            }
        }
    }
    return codeLines
};

fn.getTypeOfLine = function (lines) {
    let valueToPush = [];

    for(let i = 0;i<lines.length;i++) {
        let type = rules.findType(lines[i][0]);
        if (type !== 'undefined' && type !== '') {
            lines[i].splice(lines[i].length,0,type);
        } else {
            console.log('Unable to detect type.')
        }
    }
    return lines;
};

fn.filterComments = function (code) {
    let comments = [];
    let commentExpression = /#(.*)/g;

    for (let i = 0;i<code.length;i++) {
        for (let j = 0;j<code[i].length; j++) {
            if (commentExpression.test(code[i][j])) {
                comments.push(code[i][j].match(commentExpression)[0], {"codeBlock: ": i, "Line: ": j});
            }
        }
    }

    return comments;
};

//TODO NOT working --> Next steps: Identify variables of identified functions, process loops...
fn.deleteComments = function (code) {
    let commentExpression = /#(.*)/g;
    for(let i = 0; i<code.length;i++) {
        for (let j = 0;j<code[i].length; j++) {
            if (commentExpression.test(code[i][j])) {
                let comment = code[i][j].match(commentExpression)[0];
                code[i][j].replace(comment,'');
            }
        }
    }
    return code;
};



module.exports = fn;