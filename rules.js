let areYou = {};


const variable = function (content) {
    //Test for variable of form v = x or v <- x
    const isVariable1 = /^\b(?![(])\w*\s?=\s?\w+/;
    const isVariable2 = /^\b(?![(])\w*\s?<-\s?\w+/;

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

const loadOtherFile = function (content) {
    const isExFile = /(?:source)/;

    if (isExFile.test(content) == true) {
        return isExFile;
    }
};

const sequence = function (content) {
    const isSequence = /(?<!:):(?!:)/;

    if (isSequence.test(content) == true) {
        return isSequence;
    }
};

const inlineFunction = function (content) {
    const isInlineFunction = findFunctions(content);
    const inlineFunctionFromLibrary = /\w+(.)::(.)\w+/;
    if (isInlineFunction == true || inlineFunctionFromLibrary == true) {
        return isInlineFunction;
    }
};
const variableCall = function (content) {
    const isVariableCall = /^((?![=:(){}]).)*$/;
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
        if (type !== 'undefined') {
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
            //console.log('variable found ');
            type = 'variable';
        }
        else if(fun(file)) {
            //console.log('function found ');
            type = 'function';
        }
        else if(inlineFunction(file)) {
            //console.log('inlineFunction found ');
            type = 'inlineFunction';
        }
        else if(loadOtherFile(file)) {
            //console.log('inlineFunction found ');
            type = 'exFile';
        }
        else if(lib(file)) {
            //console.log('library found ');
            type = 'library';
        }
        else if (forloop(file)) {
            type = 'forLoop';
        }
        else if (whileloop(file)) {
            type = 'whileLoop';
        }
        else if (repeatloop(file)) {
            type = 'repeatLoop';
        }
        else if (variableCall(file)) {
            //console.log('variable call found');
            type = 'variable call';
        }
        else if (conditional(file)) {
            //console.log('variable call found');
            type = 'conditional';
        }
        else if (sequence(file)) {
            //console.log('variable call found');
            type = 'sequence';
        }else{
            type = '';
                //console.log("Unable to detect type in line " + i + "!");
                //console.log();
        }
        return type;
};



//Content in Brackets
//Loops
processBracketContentLoops = function (brContent,type) {
    let parts = brContent[0].split(' ');
    if (type == 'forLoop') {
        let val = parts[0];
        let sequence = parts[2];
        return {
            val: val,
            sequence: sequence
        };
    } else if (type == 'whileLoop') {
        let val = parts[0];
        let operator = parts[1];
        let sequence = parts[3];
        return {
            val: val,
            operator: operator,
            sequence: sequence
        }
    }
};
//InlineFunctions
processBracketContentInFun = function (funContent) {
    let parts = [];
    for(let i = 0; i<funContent.length; i++){
        let con = funContent[i].split(',');
        parts.push(con)
    }
    return{
        args:parts
    }
};

//Variables
processVarContent = function (varContent) {
    let variable = varContent.substring(0,varContent.indexOf('='));
    let value = varContent.substring(varContent.indexOf('=')+1);
    return{
        variable:variable,
        value:value
    }
};
/********************************************************
//InlineFunctions TODO Ready: Yes
//Loops: TODO Ready: Yes
//Variables TODO Ready: Yes
//Functions (Creation not calls) TODO Ready: Noooo
//conditional (if) TODO Ready: yes
//variable calls TODO Ready: No
//lib TODO Ready: No
//other R files TODO Ready: No
//sequence TODO Ready: No
***********************************************************/
//TODO Loops
//TODO --> Next steps: 1)Identify variables of identified functions, 2)Trace back variables...
areYou.processLoop = function (json) {
    for (let i = 0; i < json.Lines.length; i++){
        if(json.Lines[i].type == 'forLoop' || json.Lines[i].type == 'whileLoop' || json.Lines[i].type == 'repeatLoop' ){
            let end =  searchEnd(json,json.Lines[i].codeBlock, json.Lines[i].Line);
            let start = i;
            addLoopContent(json,start,end);
            if(json.Lines[i].type != 'repeatLoop') {
                let brCont = getContentInBrackets(json.Lines[i].value, json.Lines[i].type);
                let brContProccessed = processBracketContentLoops(brCont, json.Lines[i].type);
                brContProccessed.type = areYou.findType(brContProccessed.sequence);
                json.Lines[i].loopOver = brContProccessed;
            }
        }
    }
    let processedLoop = deleteDups(json);
    return processedLoop;

};

addLoopContent = function (json,startOfLoopIndex,endOfLoopIndex) {
    let numOfItems = 0;
    json.Lines[startOfLoopIndex].content = [];
    for(let i = startOfLoopIndex+1; i < endOfLoopIndex;i++){
        let line = i;
        let value = json.Lines[i].value;
        json.Lines[startOfLoopIndex].content[numOfItems] = {line,value};
        numOfItems++;
    }
    console.log(json);
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

deleteDups = function (json) {
    let lineOfLoopContent = [];
    for(let j = 0; j<json.Lines.length;j++){
        if(json.Lines[j].type === 'forLoop' || json.Lines[j].type === 'whileLoop' || json.Lines[j].type === 'repeatLoop' || json.Lines[j].type === 'conditional'){
            if(json.Lines[j].content != undefined) {
                for (let k = 0; k < json.Lines[j].content.length; k++) {
                    lineOfLoopContent.push(json.Lines[j].content[k].line);
                }
            }
        }
    }
    //Then delete dublicate items by creating new json
    let noDuplicateIndex = json.Lines.filter(a => !lineOfLoopContent.includes(a.Line));
    //json.Lines.splice(dublicateIndex,1);
    return noDuplicateIndex;
};

//TODO Inline functions...
areYou.processInlineFunction = function (json) {
    let typeArray = [];
    for (let i = 0; i < json.Lines.length; i++){
        if(json.Lines[i].type == 'inlineFunction'){
            let funCont = getContentInBrackets(json.Lines[i].value);
            let fun = getFunction(json.Lines[i].value);
            console.log(fun);
            let funContProcessed = processBracketContentInFun(funCont);
            json.Lines[i].call = fun;
            json.Lines[i].content = funContProcessed;
            typeArray = [];
            for (let j = 0; j < funContProcessed.args.length;j++){
                let type = areYou.findType(funContProcessed.args[j]);
                typeArray.push(type);
                funContProcessed.type = typeArray;
            }



        }
    }
    return json
};

//TODO Variables
areYou.processVariables = function (json) {
    for (let i = 0; i < json.Lines.length;i++){
        if(json.Lines[i].type == 'variable'){
            let varCont = json.Lines[i].value;
            let varContProcessed = processVarContent(varCont);
            varContProcessed.type = areYou.findType(varContProcessed.value);
            json.Lines[i].content = varContProcessed;
        }
    }
    return json;
};

//TODO Cond
areYou.processCond = function (json) {
    for (let i = 0; i < json.Lines.length;i++) {
        if (json.Lines[i].type == 'conditional') {
            let end =  searchEnd(json,json.Lines[i].codeBlock, json.Lines[i].Line);
            let start = i;
            addLoopContent(json,start,end);
        }
    }
    let processedCond = deleteDups(json);
    return processedCond;
};

//TODO VarCall ---> Here you stopped
areYou.processVarCall = function (json) {
    for (let i = 0; i < json.Lines.length;i++) {
        if (json.Lines[i].type == 'conditional') {
            let varCallCont = json.Lines[i].value;
            json.Lines[i].content.value = varCallCont;
        }
    }
    return json;
};

//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;

    if(!forloop(content)|| !whileloop || !repeatloop){
        if (isFunction.test(content)) {
            return true;
        }
    }
};

getFunction = function (content) {
    let fun = content.substring(0,content.indexOf('('));
    console.log(fun);
    return fun;
};

getContentInBrackets = function (content,type) {
    let start = content.indexOf('(');
    let end = content.lastIndexOf(')');
    let innerContent = content.substring(start + 1, end);
    let variables = innerContent.split(',');
    return variables;

};

module.exports = areYou;









