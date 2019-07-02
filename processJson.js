const rules = require('./rules');
const _ = require('lodash/core');

let pJ = {};

pJ.addFileContentToJson = function (jsonObj) {
    let loop = rules.processLoop(jsonObj);
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

processJsonTypeInlineFunction = function (jsonObj,type) {
    if (type == 'inlineFunction'){

    }
};



processJsonTypeWithoutLoopsAndConds = function (jsonObj, type) {
        switch (type) {
            case 'variable':
                return rules.processVariables(jsonObj);
                break;
            case 'variable call':
                return rules.processVarCall(jsonObj);
                break;
            case 'sequence':
                return rules.processSequence(jsonObj);
                break;
            default:
                console.log('different type detected');

        }
};

processJsonTypeLoopsAndConds = function (jsonObj, type) {
    switch (type) {
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
            console.log('different type detected');

    }
};



pJ.ProcessNestedCont = function (jsonObj) {
    console.log(allKeys(jsonObj));
    console.log(JSON.stringify(jsonObj));
    let loopTypes = ['forLoop','whileLoop','repeatLoop','conditional'];
    for (let i = 0; i<jsonObj.Lines.length;i++){
        if(!loopTypes.includes(jsonObj.Lines[i].type)) {
            if (jsonObj.Lines[i].content.value != undefined) {
                processJsonTypeWithoutLoopsAndConds(jsonObj, jsonObj.Lines[i].content.type);
            }
        }
        if(jsonObj.Lines[i].type == 'inlineFunction'){
            if(jsonObj.Lines[i].content.args.value instanceof Object){
                console.log('OBJECT: ' + jsonObj.Lines[i].content.args.value);
            }
        }
        if(loopTypes.includes(jsonObj.Lines[i].type)){

        }
    }
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