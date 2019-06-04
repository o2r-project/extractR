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
    let commentOnly = /^#.*$/g;


    for (let i = 0;i<code.length;i++) {
        for (let j = 0;j<code[i].length; j++) {
            if (code[i][j] != '' && commentOnly.test(code[i][j]) === false) {
                codeLines.push({"value":code[i][j],"codeBlock": i, "Line": j});
            }
        }
    }
    return codeLines;
};

fn.getTypeOfLine = function (lines) {
    //console.log('VALUE: ' + lines[1].value);
    //console.log('Index: ' + JSON.stringify(lines[1]));
    for(let i = 0;i<lines.length;i++) {
        let type = rules.findType(lines[i].value);
        if (type !== 'undefined' && type !== '') {
            lines[i].type = type;
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
    //console.log(JSON.stringify(code));
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


//TODO --> Next steps: 1)Identify variables of identified functions, 2)Trace back variables...
fn.processLoop = function (json) {
    for (let i = 0; i < json.length; i++){
        if(json[i].type == 'loop'){
          let end =  searchEnd(json,json[i].codeBlock, json[i].Line);
          let start = i;
          addLoopContent(json,start,end);
        }
    }

};

addLoopContent = function (json,startOfLoopIndex,endOfLoopIndex) {
    let jsonObj = {'Lines': json};
    let numOfItems = 0;
    jsonObj.Lines[startOfLoopIndex].content = [];
    for(let i = startOfLoopIndex+1; i<= endOfLoopIndex;i++){
        let line = i;
        let value = jsonObj.Lines[i].value;
        console.log('value: ' + value);
        console.log(numOfItems);
        jsonObj.Lines[startOfLoopIndex].content[numOfItems] = {line,value};
        numOfItems++;
    }
    console.log(JSON.stringify(jsonObj));
};

searchEnd = function (json,blockIndex, lineIndex) {
    let openCount = 0;
    let closedCount = 0;
    let opening = /{/g;
    let closing = /}/g;
    for (let i = lineIndex; i < json.length;i++){
        if(opening.test(json[i].value)){
            console.log(json[i].value.match(opening).length);
            openCount+= json[i].value.match(opening).length;

        } else if(closing.test(json[i].value)){
            closedCount+= json[i].value.match(closing).length;
            openCount -= json[i].value.match(closing).length;
        }
        if ((openCount == 0) && i != lineIndex){
            console.log('END: ' + json[i].Line);
            return json[i].Line;
        }
    }
};



module.exports = fn;