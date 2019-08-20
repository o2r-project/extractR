let areYou = {};

//TODO Create small example finally :)



//TODO
const variable = function (content) {
    //Test for variable of form v = x or v <- x
    const isVariable1 = /^\s*\b(?![(])[\w\[\],\s]*\s?=\s?[\w\[\]]+/;
    const isVariable2 = /^\s*\b(?![(])[\w\[\],\s]*\s?<-\s?[\w\[\]]+/;

    if (!fun(content) && (isVariable1.test(content) || isVariable2.test(content))) {
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

    if (isWhileLoop.test(content) == true) {
        return isWhileLoop;
    }
};

const repeatloop = function (content) {
    const isRepeatLoop = /(?:repeat)/;

    if (isRepeatLoop.test(content) == true) {
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

    if (isVariableCall.test(content) == true || isVariableCall2.test(content) == true) {
        return isVariableCall;
    }
};

areYou.getTypeOfLine = function (lines) {
    for (let i = 0; i < lines.length; i++) {
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
    if (variable(file)) {
        //console.log('variable found ');
        type = 'variable';
    }
    else if (fun(file)) {
        //console.log('function found ');
        type = 'function';
    }
    else if (inlineFunction(file)) {
        //console.log('inlineFunction found ');
        type = 'inlineFunction';
    }
    else if (loadOtherFile(file)) {
        //console.log('inlineFunction found ');
        type = 'exFile';
    }
    else if (lib(file)) {
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
    } else {
        type = '';
        //console.log("Unable to detect type in line " + i + "!");
        //console.log();
    }
    return type;
};



//Content in Brackets
//Loops
processBracketContentLoops = function (brContent, type) {
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
processBracketContentInFun = function (funContent) {
    let parts = [];
    for (let i = 0; i < funContent.length; i++) {
        //console.log(funContent.length);
        let con = funContent[i].split(',');
        parts.push(con[0]);
        //console.log(parts);
    }
    return {
        args: { 'value': parts }
    }
};




//Variables
processVarContent = function (varContent) {
    //console.log('CONT ' + varContent);
    if (varContent.indexOf('=') != -1) {
        let variable = varContent.substring(0, varContent.indexOf('='));
        let value = varContent.substring(varContent.indexOf('=') + 1);
        return {
            variable: variable,
            value: value
        }
    } else {
        let variable = varContent.substring(0, varContent.indexOf('<'));
        let value = varContent.substring(varContent.indexOf('<') + 2);
        return {
            variable: variable,
            value: value
        }
    }

};

processMultiLineVarContent = function (jsonAtVarLine, startIndex) {
    //console.log(startIndex);
    //console.log('jsonAtVarLine ' + jsonAtVarLine);
    let closingBracket = /[)]/;
    let value = '';
    let end = 0;
    let firstOcc = true;
    for (let i = startIndex; i < jsonAtVarLine.length; i++) {
        if (closingBracket.test(jsonAtVarLine[i].value) == true && firstOcc == true) {
            firstOcc = false;
            end = i;
            //console.log('THIS IS THE END ' + end);
            for (let j = startIndex; j <= end; j++) {
                value += jsonAtVarLine[j].value;
                value = value.replace(/ /g, '');
            }
        }
    }
    return {
        value: value,
        end: end
    };
};
/********************************************************
//InlineFunctions TODO Ready: Yes
//Loops: TODO Ready: Yes
//Variables TODO Ready: Yes
//Functions (Creation not calls) TODO Ready: yes
//conditional (if) TODO Ready: yes
//variable calls TODO Ready: Yes
//lib TODO Ready: yes
//other R files TODO Ready: Yes
//sequence TODO Ready: yes
***********************************************************/

areYou.processFunction = function (json,index) {
    let startEnd = [];
    let varCont = json[index].value
    if (varCont.indexOf('(') != -1 && varCont.indexOf(')') != -1 || varCont.indexOf('(') == -1 && varCont.indexOf(')') == -1) {
        let end = searchEnd(json, json[index].codeBlock, json[index].Line);
        let start = index;
        let vars = areYou.getContentInBrackets(json[index].value);
        json[index].content = { 'vars': vars };
        startEnd.push(start, end);
    } else {
        let preprocessMultiLineArgFun = processMultiLineVarContent(json, index);
        //console.log('preprocessMultiLineArgFun ' + JSON.stringify(preprocessMultiLineArgFun))
        let start = index
        //console.log('Start ' + start)
        let endOfFunArgs = preprocessMultiLineArgFun.end
        let end = searchEnd(json, json[index].codeBlock, json[endOfFunArgs].Line);
        //console.log('END ' + end)
        let vars = areYou.getContentInBrackets(preprocessMultiLineArgFun.value);
        json[index].content = { 'vars': vars };
        let max = 2;
        if (startEnd.length < max) {
            startEnd.push(start, end);
            console.log('startEnd ' + startEnd);
        }
    }
    if (startEnd.length > 1) {
        let jsonNew = json.filter(line => line.Line <= startEnd[0] || line.Line > startEnd[1]);
        json = jsonNew
    }
    return {
        json:json[index],
        end: startEnd[1]
    }
};
areYou.processLoop = function (json,index) {
    let end = searchEnd(json, json[index].codeBlock, json[index].Line);
    console.log('LOOPEND ' + end);
    let start = json[index].Line;
    addLoopContent(json,index,start, end);
    if (json[index].type != 'repeatLoop') {
        let brCont = areYou.getContentInBrackets(json[index].value, json[index].type);
        let brContProccessed = processBracketContentLoops(brCont, json[index].type);
        brContProccessed.type = areYou.findType(brContProccessed.sequence);
        json[index].loopOver = brContProccessed;
    }
    let processedLoop = deleteDups(json,index,end);
    return {
        json:processedLoop[index],
        end:end
    }
};
addLoopContent = function (json,index,startOfLoopLine, endOfLoopIndex) {
    let numOfItems = 0;
    json[index].content = [];

    let endAt = endOfLoopIndex;
    endOfJsonLoop = json.findIndex(item => {
        return item.Line == endAt
    })

    console.log('ENDOfJsonLoop ' + endAt);
    let singleLineTypes = ['variable call','library', 'exFile', 'sequence', 'inlineFunction'];
    let endIndex = 0;
    for (let i = index + 1; i < endOfJsonLoop; i++) {
        
        let line = i;
        let value = json[i].value;
       
        let type = areYou.findType(value);
        
        if (singleLineTypes.includes(type)){
            json[index].content[numOfItems] = { line, value, type };
            numOfItems++;
            endIndex = numOfItems;
        } else {
            value = findValue(json,i);
            json[index].content[numOfItems] = { line, value, type };
            numOfItems++;
            endIndex = value.end
           
        } 
        i = endIndex;
    }
    return json;
};
//TODO: Change also other parts, but it works for INSYDE
findValue = function(json,index){
    if(json[index].type == 'function'){
        console.log('function');
        let fun = areYou.processFunction(json,index);
        return {
            json:fun.json,
            end:fun.end
        }
    }
    else if(json[index].type == 'conditional'){    
        console.log('cond in find value');
        let cond = areYou.processCond(json,index);
       return{
           json:cond.json,
           end:cond.end
       }
    }
    else if(json[index].type == 'forLoop' || json[index].type == 'whileLoop' || json[index].type == 'repeatLoop'){    
        console.log('loop');
        let loop = areYou.processLoop(json,index);
        return{
            json:loop.json,
            end:loop.end
        }
    }
    else if(json[index].type == 'variable'){
        let variable = areYou.processVariables(json,index,false);
        if (variable.multi == false){
            return{
                 json:variable.json.content,
                 end:index
            }
        } else {
            return{
                json:variable.json.content,
                end:variable.end
            }
        }
    }
};

searchEnd = function (json, blockIndex, lineIndex) {
    lineIndex = json.findIndex(a => a.Line == lineIndex);
    let openCount = 0;
    let closedCount = 0;
    let opening = /{/g;
    let closing = /}/g;
    for (let i = lineIndex; i < json.length; i++) {
        if (opening.test(json[i].value)) {
            openCount += json[i].value.match(opening).length;
            //console.log(openCount)   
        }
        if (closing.test(json[i].value)) {
            closedCount += json[i].value.match(closing).length;
            openCount -= json[i].value.match(closing).length;
            //console.log(closedCount)
            //console.log(openCount)        
        }
        //console.log('i' + i);
        //console.log(json.length);
        if (openCount == closedCount & openCount != 0 & i == json.length - 1) {
            let loopsAndConds = findLoopsAndConds(json);
            //console.log('Im finshed ' + loopsAndConds);
            return loopsAndConds;

        }
        if ((openCount == 0) && i != lineIndex) {
            return json[i].Line;
        }
    }
};

//ATTENTION: Only works for one neasted loop or cond in this version TODO
findLoopsAndConds = function (json) {
    let forLoopInCond = findNested(json, 'conditional', 'forLoop')
    let CondInForLoop = findNested(json, 'forLoop', 'conditional')
    let loc = 0;
    //console.log(forLoopInCond);
    //console.log(CondInForLoop);
    if (forLoopInCond.location.length > 0) {
        loc = forLoopInCond.location;
    } else if (CondInForLoop.location.length > 0) {
        loc = forLoopInCond.location;
    }
    return loc;
}

findNested = function (json, outerType, innerType) {
    let openingBracketsFound = 0;
    let closingBracketsFound = 0;
    let opening = /{/g;
    let closing = /}/g;
    let location = [];

    for (let i = 0; i < json.length; i++) {
        if (json[i].type == outerType && json[i].content == undefined) {
            json.forEach(element => {
                //console.log('ELEM ' + JSON.stringify(element));
                if (element.type == innerType) {
                    element.content.forEach(value => {
                        //console.log('VAAAAAAAL ' + value.value);
                        if (opening.test(value.value)) {
                            openingBracketsFound += value.value.match(opening).length;
                            location.push(value.line);
                        } else if (closing.test(value.value)) {
                            //console.log('CLOOOOOOOOOOOOOOOSING FOUND ' + JSON.stringify(value))
                            closingBracketsFound += value.value.match(closing).length;
                            location.push(value.line);
                        }
                    });
                }
            });
        }
    }
    return {
        closingBracketsFound: closingBracketsFound,
        openingBracketsFound: openingBracketsFound,
        location: location
    }
}

deleteDups = function (json,index,end) {
    let lineOfLoopContent = [];
        if (json[index].type === 'forLoop' || json[index].type === 'whileLoop' || json[index].type === 'repeatLoop' || json[index].type === 'conditional') {
            if (json[index].content != undefined) {
                let noDuplicateIndex = json.filter(a => a.Line <= end);
                json = noDuplicateIndex;
            }
        }
    //Then delete dublicate items by creating new json
    console.log('IN delete dups ' + JSON.stringify(json));
    return json;
};

//TODO Inline functions...
areYou.processInlineFunction = function (json,index) {
    let typeArray = [];
    //console.log('LENGTH: ' + json.length);
    //console.log('InlineFunctions: ' + console.log(JSON.stringify(json)));
    let funCont = areYou.getContentInBrackets(json[index].value);
    let fun = areYou.getFunction(json[index].value);
    //console.log(fun);
    let funContProcessed = processBracketContentInFun(funCont);
    json[index].call = fun;
    json[index].content = funContProcessed;
    typeArray = [];
    for (let j = 0; j < funContProcessed.args.value.length; j++) {
        let type = areYou.findType(funContProcessed.args[j]);
        typeArray.push(type);
        funContProcessed.type = typeArray;
    }
    return json[index]
};

areYou.processVariables = function (json, index,multi) {
    let linesOfMultiVar = [];
    let end;
    let varCont = json[index].value;
    if (varCont.indexOf('(') != -1 && varCont.indexOf(')') != -1 || varCont.indexOf('(') == -1 && varCont.indexOf(')') == -1) {
        let varContProcessed = processVarContent(varCont);
        varContProcessed.type = areYou.findType(varContProcessed.value);
        json[index].content = varContProcessed;
        return {
            json:json[index],
            multi:false
        }
    } else {
        //console.log('I am multi');
        let preprocessVarCond = processMultiLineVarContent(json, index);
        let varContProcessed = processVarContent(preprocessVarCond.value);
        varContProcessed.type = areYou.findType(varContProcessed.value);
        json[index].content = varContProcessed;
        let start = index + 1;
        end = preprocessVarCond.end;
        linesOfMultiVar.push(start, end);
    }
    //Filter out duplicates
    if (linesOfMultiVar.length > 0) {
        json = json.filter(line => !linesOfMultiVar.includes(line.Line));
        linesOfMultiVar = [];
        return {
            json:json[index],
            end:end,
            multi:true
        }

        /*if(json[i].content != undefined && json[i].content.type == 'variable'){
            let varCont = json[i].content.value;
            let varContProcessed = processVarContent(varCont);
            varContProcessed.type = areYou.findType(varContProcessed.value);
            json[i].content.content = varContProcessed;
        }*/
    }
};

//TODO Cond
areYou.processCond = function (json,index) {
    //console.log('Cond found ' + JSON.stringify(json));
    let endLine = searchEnd(json, json[index].codeBlock, json[index].Line);
    let startLine = json[index].Line;
    //console.log('Start ' + startLine)
    //console.log('End  ' + endLine)
    //console.log('INDEX ' + index);
    addLoopContent(json,index,startLine, endLine);

    let processedCond = deleteDups(json,index,endLine);
    return {
        json:processedCond[index],
        end:endLine
    }
};

//TODO VarCall
areYou.processVarCall = function (json,index) {
    let varCallCont = json[index].value;
    json[index].content = { 'value': varCallCont };
    /* if(json[index].content != undefined && json[index].content.type == 'variable call'){
         let varCallCont = json[index].content.value;
         json[index].content.content = {'value':varCallCont};
     }*/
    return json[index];
};

//TODO lib
areYou.processLib = function (json,index) {
    //console.log('LIB ' + JSON.stringify(json[index]));
    let libCont = json[index].value;
    let calledLib = areYou.getContentInBrackets(libCont);
    json[index].content = calledLib;
    return json[index];
};

areYou.processExFile = function (json,index) {
    let file = json[index].value;
    let LinkToFile = areYou.getContentInBrackets(file)[0];
    json[index].content = LinkToFile;
    return json[index];
};

areYou.processSequence = function (json,index) {
    let seq = json[index].value;
    json[index].content = seq;
    // if(json[index].content != undefined && json[index].content.type == 'sequence'){
    //     let seq = json[index].content.value;
    //     json[index].content.content = seq;
    // }
    return json[index];
};

//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b|\blibrary\b|\bsource\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;

    if (!forloop(content) || !whileloop || !repeatloop) {
        if (isFunction.test(content)) {
            return true;
        }
    }
};

areYou.getFunction = function (content) {
    let fun = content.substring(0, content.indexOf('('));
    //console.log(fun);
    return fun;
};

areYou.getContentInBrackets = function (content) {
    let start = content.indexOf('(');
    let end = content.lastIndexOf(')');
    let innerContent = content.substring(start + 1, end);
    let variables = innerContent.split(',');
    return variables;

};

module.exports = areYou;









