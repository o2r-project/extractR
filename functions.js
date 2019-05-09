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
}

fn.extractPlotFunction = function (lineContent) {
    //
}


module.exports = fn;