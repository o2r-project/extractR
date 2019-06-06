let areYou = {};


const variable = function (content) {
    //Test for variable of form v = x or v <- x
    const isVariable1 = /.*?=(.*)/;
    const isVariable2 = /.*?<-(.*)/;

    if (!fun(content) && (isVariable1.test(content) || isVariable2.test(content))){
        return isVariable1;
    }

};

const forloop = function (content) {
    const isForLoop = /(?:for)/;

    if (isForLoop.test(content) == true) {
        return isForLoop;
    }
};

const whileloop = function (content) {
    const isWhileLoop = /(?:while)/;

    if(isWhileLoop.test(content) == true){
        return isWhileLoop;
    }
};

const repeatloop = function (content) {
    const isRepeatLoop = /(?:repeat)/;

   if(isRepeatLoop.test(content) == true){
        return isRepeatLoop;
    }
};

const conditional = function (content) {
  const isConditional = /(?:if)/;

    if (isConditional.test(content) == true) {
        return isConditional;
    }
};

const fun = function (content) {
    const isFunction = /(?:function)/;

    if (isFunction.test(content) == true) {
        return isFunction;
    }
};

const lib = function (content) {
    const isLibrary = /(?:library)/;

    if (isLibrary.test(content) == true) {
        return isLibrary;
    }
};

const inlineFunction = function (content) {
    const isInlineFunction = findFunctions(content);
    if (isInlineFunction == true) {
        return isInlineFunction;
    }
};
const variableCall = function (content) {
    const isVariableCall = /[\w\-\_]+$/;
    const isVariableCall2 = /([\w])_([\w])/;

    if(isVariableCall.test(content) == true || isVariableCall2.test(content) == true){
        return isVariableCall;
    }
};

areYou.getTypeOfLine = function (lines) {
    //console.log('VALUE: ' + lines[1].value);
    //console.log('Index: ' + JSON.stringify(lines[1]));
    for(let i = 0;i<lines.length;i++) {
        let type = areYou.findType(lines[i].value);
        if (type !== 'undefined' && type !== '') {
            lines[i].type = type;
        } else {
            console.log('Unable to detect type.')
        }
    }
    return lines;
};

areYou.findType = function (file) {
    let type = '';
    //console.log(file);
        if(variable(file)) {
            //TODO processVariable(file[i]);
            //console.log('variable found ');
            type = 'variable';
        } else if(fun(file)) {
            //TODO processFunction(file[i]);
            //console.log('function found ');
            type = 'function';
        } else if(inlineFunction(file)) {
            //TODO processInlineFunction(file[i]);
            //console.log('inlineFunction found ');
            type = 'inlineFunction';
        } else if(lib(file)) {
            //TODO processLibrary(file[i]);
            //console.log('library found ');
            type = 'library';
        } else if (forloop(file)) {
            type = 'forLoop';
        }
        else if (whileloop(file)) {
            type = 'whileLoop';
        }
        else if (repeatloop(file)) {
            type = 'repeatLoop';
        }
        else if (variableCall(file)) {
            //TODO processloop(file[i]);
            //console.log('variable call found');
            type = 'variable call';
        }
        else if (conditional(file)) {
            //TODO processCond(file[i]);
            //console.log('variable call found');
            type = 'conditional';
        }else{
                //console.log("Unable to detect type in line " + i + "!");
                //console.log();
        }
        return type;
};

getVariableOfLoop = function (content) {

};


//Loops
//TODO --> Next steps: 1)Identify variables of identified functions, 2)Trace back variables...
areYou.processLoop = function (json) {
    for (let i = 0; i < json.Lines.length; i++){
        if(json.Lines[i].type == 'forLoop' || json.Lines[i].type == 'whileLoop' || json.Lines[i].type == 'repeatLoop' ){
            let end =  searchEnd(json,json.Lines[i].codeBlock, json.Lines[i].Line);
            let start = i;
            addLoopContent(json,start,end);
            getContentInBrackets(json.Lines[i].value)
        }
    }

    return json

};

//TODO: AddContent() function for every content type


addLoopContent = function (json,startOfLoopIndex,endOfLoopIndex) {
    let numOfItems = 0;
    let lineOfLoopContent = [];
    json.Lines[startOfLoopIndex].content = [];
    for(let i = startOfLoopIndex+1; i < endOfLoopIndex;i++){
        let line = i;
        let value = json.Lines[i].value;
        json.Lines[startOfLoopIndex].content[numOfItems] = {line,value};
        lineOfLoopContent.push(startOfLoopIndex);
        numOfItems++;
    }
    console.log('175 ' + lineOfLoopContent);
    //Then delete dublicate items TODO: Make it work more than once
    for(let j = 0;j<lineOfLoopContent.length;j++) {
            let dublicateIndex = json.Lines.findIndex(a => a.Line == lineOfLoopContent[j]);
            console.log('DI: ' + dublicateIndex);
            //json.Lines.splice(dublicateIndex,1);
    }
    return json;
};


searchEnd = function (json,blockIndex, lineIndex) {
    lineIndex = json.Lines.findIndex(a => a.Line == lineIndex);
    let openCount = 0;
    let closedCount = 0;
    let opening = /{/g;
    let closing = /}/g;
    for (let i = lineIndex; i < json.Lines.length;i++){
        if(opening.test(json.Lines[i].value)){
            openCount+= json.Lines[i].value.match(opening).length;
        } else if(closing.test(json.Lines[i].value)){
            closedCount+= json.Lines[i].value.match(closing).length;
            console.log(json.Lines[i].value.match(closing).length);
            openCount -= json.Lines[i].value.match(closing).length;
        }
        if ((openCount == 0) && i != lineIndex){
            return json.Lines[i].Line;
        }
    }
};

//Inline functions...





//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;

    if(!forloop(content)|| !whileloop || !repeatloop){
        if (isFunction.test(content)) {
            return true;
        }
    }
};


getContentInBrackets = function (content) {
    let start = content.indexOf('(');
    let end = content.lastIndexOf(')');
    let innerContent = content.substring(start+1,end);
    let variables = innerContent.split(',');
    return variables;
};

module.exports = areYou;









