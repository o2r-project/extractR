const rules = require('./rules');
const fn = require('./functions');


let pJ = {};

//TODO change proceesedJson var in for loop
pJ.addFileContentToJson = function (jsonObj) {
    let processedJson = [];
    let numberOfLoopRuns = 0;
    console.log('LENGTH ' + JSON.stringify(jsonObj.Lines[19]));
    for (let i = 0; i < jsonObj.Lines.length;i++){
        console.log('IIIII ' + i);
       // let notProcessed = processedJson.slice(i);
        if(jsonObj.Lines[i].type == 'function'){
            let fun = rules.processFunction(jsonObj.Lines,i);
            processedJson.push(fun[numberOfLoopRuns]);
        }
        else if(jsonObj.Lines[i].type == 'conditional'){    
            let cond = rules.processCond(jsonObj.Lines,i);
            processedJson.push(cond.processedCond[numberOfLoopRuns]);
            i = cond.end 
            //console.log('LOOPSPRO ' + JSON.stringify(processedJson));
        }
        else if(jsonObj.Lines[i].type == 'forLoop' || jsonObj.Lines[i].type == 'whileLoop' || jsonObj.Lines[i].type == 'repeatLoop'){    
            let loop = rules.processLoop(jsonObj.Lines,i);
            processedJson.push(loop.processedLoop[numberOfLoopRuns]);
            i = loop.end 
        }
        else if(jsonObj.Lines[i].type == 'inlineFunction'){
            //console.log('NOTPRO ' + JSON.stringify(notProcessed));    
            let inline = rules.processInlineFunction(jsonObj.Lines,i);
            processedJson.push(inline[numberOfLoopRuns]);
        }
        else if(jsonObj.Lines[i].type == 'variable'){
            console.log('var found');
            let variable = rules.processVariables(jsonObj.Lines,i,false);
            if (variable.multi == false){
                processedJson.push(variable.json[numberOfLoopRuns]);
            } else {
                processedJson.push(variable.json[numberOfLoopRuns]);
                i = variable.end 
            }
        }
        else if(jsonObj.Lines[i].type == 'variable call'){    
            let varCall = rules.processVarCall(jsonObj.Lines,i);
            processedJson.push(varCall[numberOfLoopRuns]);
        }
        else if(jsonObj.Lines[i].type == 'library'){    
            let lib = rules.processLib(jsonObj.Lines,i);
            processedJson.push(lib[numberOfLoopRuns]);
        }
        else if(jsonObj.Lines[i].type == 'exFile'){    
            let exFile = rules.processExFile(jsonObj.Lines,i);
            processedJson.push(exFile[numberOfLoopRuns]);
        }
        else if(jsonObj.Lines[i].type == 'sequence'){    
            let seq = rules.processSequence(jsonObj.Lines,i);
            processedJson.push(exFile[numberOfLoopRuns]);
        }
        console.log('NR ' + numberOfLoopRuns);
        numberOfLoopRuns++;
    //pJ.ProcessNestedCont(contJson);
    }
    //console.log('ProcessedJson ' + JSON.stringify(processedJson))
    return processedJson;
};

//TODO: Add lines to find all plot functions in script
pJ.findPlotLines = function (jsonObj,plotFunctions) {
    let plotFunctionsToFind = fn.readFile(plotFunctions);
    let lines = plotFunctionsToFind.split(/\r?\n/);
};



//Has call,content.args.value[array] and content.args.type[array]
//TODO Add further possible types after testing
processJsonTypesFromInlineFunction = function (jsonObj) {
    let type = jsonObj.content.type;
    let value = jsonObj.content.args.value;
    for (let i = 0; i < value.length;i++) {
        if (type[i] == 'variable call') {
            if (value[i].indexOf('=') != -1) {
                value = value[i].substring(0, value[i].indexOf('='))
            }
            if(value[i].indexOf('<') != -1){

            }
            jsonObj.variables = value;
        }
    }
    return jsonObj;
};

processJsonTypesFromVariables = function(jsonObj){
    let type = jsonObj.content.type;
    let value = jsonObj.content.value;
    let variables = rules.getContentInBrackets(value);
    console.log('VARS ' + variables);

};



processJsonTypeWithoutLoopsAndConds = function (jsonObj, type) {
        switch (type) {
            //has content.variable, content.value, content.type
            case 'variable':
                return processJsonTypesFromVariables(jsonObj);
                break;
                //has content.value
            case 'variable call':
                //TODO Update
                break;
                //has content.value
            case 'sequence':
                //TODO Update
                break;
            default:
                return

        }
};

processJsonTypeLoopsAndConds = function (jsonObj, type) {
    switch (type) {
        //has content, loopOver.value, loopOver.sequence,loopOver.type
        case 'forLoop':
            return rules.processLoop(jsonObj);
            break;
        case 'whileLoop':
            return rules.processLoop(jsonObj);
            break;
        case 'repeatLoop':
            return rules.processLoop(jsonObj);
            break;
        case 'conditional':
            return rules.processCond(jsonObj);
            break;
        default:
            return

    }
};



pJ.ProcessNestedCont = function (jsonObj) {
    //console.log(allKeys(jsonObj));
    //console.log(JSON.stringify(jsonObj));
    let loopsAndFun = ['forLoop','whileLoop','repeatLoop','conditional','function','inlineFunction'];

    for (let i = 0; i<jsonObj.Lines.length;i++){
        if(!loopsAndFun.includes(jsonObj.Lines[i].type)) {
            if (jsonObj.Lines[i].content.value != undefined) {
                processJsonTypeWithoutLoopsAndConds(jsonObj, jsonObj.Lines[i].content.type);
            }
        }
        if(jsonObj.Lines[i].type == 'inlineFunction'){
            if(jsonObj.Lines[i].content.args.value instanceof Object){
                //console.log('OBJECT: ' + jsonObj.Lines[i].content.args.value);
                processJsonTypesFromInlineFunction(jsonObj.Lines[i])
            }
        }
        if(loopsAndFun.includes(jsonObj.Lines[i].type)){
            //get variables of loops

        }
    }
    return jsonObj;
};

pJ.getCodeLines = function(processedJson){
    let lines = []
    lines.push({"start":30,"end":424})
    return lines
};


allKeys = function(object) {
    return Object.keys(object).reduce((keys, key) =>
            keys.concat(key,
                typeof object[key] === 'object' ? allKeys(object[key]) : []
            ),
        []
    );
}



module.exports = pJ;