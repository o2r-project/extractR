const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

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




module.exports = fn;