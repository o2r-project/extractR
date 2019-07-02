let areYou = {};

//TODO Create small example finally :)



//TODO
const variable = function (content) {
    //Test for variable of form v = x or v <- x
    const isVariable1 = /^\s*\b(?![(])[\w\[\]]*\s?=\s?[\w\[\]]+/;
    const isVariable2 = /^\s*\b(?![(])[\w\[\]]*\s?<-\s?[\w\[\]]+/;

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
    const isVariableCall = /^\s*((?![=:(){}]).)*$/;
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
//InlineFunctions --> TODO Reorder function arguments: Case1: functionArg = value, Case2: value --> Start Thursday
// Do not push it in array and make it unnecessary complicated --> Keep it simple
// content.args{1,2,3...}
processBracketContentInFun = function (funContent) {
    let parts = [];
    for(let i = 0; i<funContent.length; i++){
        let con = funContent[i].split(',');
        parts.push(con)
    }
    return{
        args:{'value':parts}
    }
};

//Variables
processVarContent = function (varContent) {
    console.log('CONT ' + varContent);
    if(varContent.indexOf('=') != -1) {
        let variable = varContent.substring(0, varContent.indexOf('='));
        let value = varContent.substring(varContent.indexOf('=') + 1);
        return{
            variable:variable,
            value:value
        }
    } else {
        let variable = varContent.substring(0, varContent.indexOf('<'));
        let value = varContent.substring(varContent.indexOf('<') + 2);
        return{
            variable:variable,
            value:value
        }
    }

};

processMultiLineVarContent = function (jsonAtVarLine,startIndex) {
    let closingBracket = /[)]/g;
    let value = '';
    let end;
    for (let i = startIndex; i<jsonAtVarLine.Lines.length; i++){
        console.log(jsonAtVarLine.Lines[i].value);
        if(closingBracket.test(jsonAtVarLine.Lines[i].value)){
            end = jsonAtVarLine.Lines[i].Line;
            for(let j = startIndex; j<= end; j++){
                value+=jsonAtVarLine.Lines[j].value;
                value = value.replace(/ /g, '');
            }
        }
    }
    return {
        value:value,
        end: end
    };
};
/********************************************************
//InlineFunctions TODO Ready: Yes
//Loops: TODO Ready: Yes
//Variables TODO Ready: Yes
//Functions (Creation not calls) TODO Ready: Noooo
//conditional (if) TODO Ready: yes
//variable calls TODO Ready: Yes
//lib TODO Ready: yes
//other R files TODO Ready: Yes
//sequence TODO Ready: yes
***********************************************************/
//TODO Loops
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
    for(let i = startOfLoopIndex+1; i <= endOfLoopIndex;i++){
        let line = i;
        let value = json.Lines[i].value;
        let type = areYou.findType(value);
        json.Lines[startOfLoopIndex].content[numOfItems] = {line,value,type};
        numOfItems++;
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
    json.Lines = noDuplicateIndex;
    return json;
};

//TODO Inline functions...
areYou.processInlineFunction = function (json) {
    let typeArray = [];
    //console.log('LENGTH: ' + json.Lines.length);
    //console.log('InlineFunctions: ' + console.log(JSON.stringify(json)));
    for (let i = 0; i < json.Lines.length; i++){
        if(json.Lines[i].type == 'inlineFunction'){
            let funCont = getContentInBrackets(json.Lines[i].value);
            let fun = getFunction(json.Lines[i].value);
            console.log(fun);
            let funContProcessed = processBracketContentInFun(funCont);
            json.Lines[i].call = fun;
            json.Lines[i].content = funContProcessed;
            typeArray = [];
            for (let j = 0; j < funContProcessed.args.value.length;j++){
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
            if(varCont.indexOf('(') != -1 && varCont.indexOf(')') != -1) {
                let varContProcessed = processVarContent(varCont);
                varContProcessed.type = areYou.findType(varContProcessed.value);
                json.Lines[i].content = varContProcessed;
            } else {
                let preprocessVarCond = processMultiLineVarContent(json,i);
                let varContProcessed = processVarContent(preprocessVarCond.value);
                varContProcessed.type = areYou.findType(varContProcessed.value);
                json.Lines[i].content = varContProcessed;
                //TODO filter dublicates between start(i) and end --> Next step
            }
        }
        if(json.Lines[i].content != undefined && json.Lines[i].content.type == 'variable'){
            let varCont = json.Lines[i].content.value;
            let varContProcessed = processVarContent(varCont);
            varContProcessed.type = areYou.findType(varContProcessed.value);
            json.Lines[i].content.content = varContProcessed;
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

//TODO VarCall
areYou.processVarCall = function (json) {
    for (let i = 0; i < json.Lines.length;i++) {
        if (json.Lines[i].type == 'variable call') {
            let varCallCont = json.Lines[i].value;
            json.Lines[i].content = {'value':varCallCont};
        }
        if(json.Lines[i].content != undefined && json.Lines[i].content.type == 'variable call'){
            let varCallCont = json.Lines[i].content.value;
            json.Lines[i].content.content = {'value':varCallCont};
        }
    }
    return json;
};

//TODO lib
areYou.processLib = function (json) {
    for (let i = 0; i < json.Lines.length;i++) {
        if (json.Lines[i].type == 'library') {
            let libCont = json.Lines[i].value;
            let calledLib = getContentInBrackets(libCont);
            json.Lines[i].content = calledLib;
        }
    }
    return json;
};

areYou.processExFile = function (json) {
    for (let i = 0; i < json.Lines.length;i++) {
        if (json.Lines[i].type == 'exFile') {
            let file = json.Lines[i].value;
            let LinkToFile = getContentInBrackets(file)[0];
            json.Lines[i].content = LinkToFile;
        }
    }
    return json;
};

areYou.processSequence = function (json) {
    for (let i = 0; i < json.Lines.length;i++) {
        if (json.Lines[i].type == 'sequence') {
            let seq = json.Lines[i].value;
            json.Lines[i].content = seq;
        }
        if(json.Lines[i].content != undefined && json.Lines[i].content.type == 'sequence'){
            let seq = json.Lines[i].content.value;
            json.Lines[i].content.content = seq;
        }
    }
    return json;
};

//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b|\blibrary\b|\bsource\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;

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

getContentInBrackets = function (content) {
    let start = content.indexOf('(');
    let end = content.lastIndexOf(')');
    let innerContent = content.substring(start + 1, end);
    let variables = innerContent.split(',');
    return variables;

};

module.exports = areYou;









