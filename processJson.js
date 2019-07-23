const rules = require('./rules');
const fn = require('./functions');


let pJ = {};

pJ.addFileContentToJson = function (jsonObj) {
    let fun = rules.processFunction(jsonObj);
    let loop = rules.processLoop(fun);
    let inlineFunc = rules.processInlineFunction(loop);
    let variable = rules.processVariables(inlineFunc);
    let cond = rules.processCond(variable);
    let varCall = rules.processVarCall(cond);
    let lib = rules.processLib(varCall);
    let exFile = rules.processExFile(lib);
    let seq = rules.processSequence(exFile);
    let contJson = seq;
    //pJ.ProcessNestedCont(contJson);
    return contJson;
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