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
    pJ.ProcessNestedCont(contJson);
    return contJson;
};

//TODO Not working --> Start here next time
pJ.ProcessNestedCont = function (jsonObj) {
    Object.entries(jsonObj.Lines).forEach(([key,value]) => {
        if (value.content != undefined) {
            let keys = Object.keys(value.content);
            console.log('Val ' + JSON.stringify(value.content));
            console.log('key ' + key);
            console.log(keys[0]);
            if (isNaN(keys[0])) {
                let type = value.content.type;
                console.log(jsonObj.Lines[key]);

                //Process non Recursive HERE

            }else{
                if (typeof Array.isArray(jsonObj.Lines[key])) {
                    console.log('RECURSIVE: ' + JSON.stringify(jsonObj.Lines[key].content));
                    pJ.ProcessNestedCont(jsonObj.Lines[key].content)
                }
            }
        }
    })

};



module.exports = pJ;