const rules = require('./rules');
const fn = require('./functions');


let pJ = {};


pJ.addFileContentToJson = function (jsonObj) {
    let processedJson = [];
    let numberOfLoopRuns = 0;
    //console.log('LENGTH ' + JSON.stringify(jsonObj.Lines[19]));
    for (let i = 0; i < jsonObj.Lines.length;i++){
        console.log('IIIII ' + i);
        //console.log(JSON.stringify(jsonObj.Lines[i]));
       // let notProcessed = processedJson.slice(i);
        if(jsonObj.Lines[i].type == 'function'){
            console.log('function');
            let fun = rules.processFunction(jsonObj.Lines,i);
            console.log(fun);
            processedJson.push(fun);
            //console.log('ProcessedJson ' + JSON.stringify(processedJson))
            console.log('FN ' + fun.end);
            i = fun.end;
        }
        else if(jsonObj.Lines[i].type == 'conditional'){    
            console.log('cond');
            let cond = rules.processCond(jsonObj.Lines,i);
            processedJson.push(cond);
            //console.log('ProcessedJsonInCond ' + JSON.stringify(processedJson))
            i = cond.end 
            //console.log('LOOPSPRO ' + JSON.stringify(processedJson));
        }
        else if(jsonObj.Lines[i].type == 'forLoop' || jsonObj.Lines[i].type == 'whileLoop' || jsonObj.Lines[i].type == 'repeatLoop'){    
            console.log('loop');
            let loop = rules.processLoop(jsonObj.Lines,i);
            processedJson.push(loop);
            //console.log('ProcessedJson ' + JSON.stringify(processedJson))
            i = loop.end 
        }
        else if(jsonObj.Lines[i].type == 'inlineFunction'){
            console.log('ILFunction');
            //console.log('NOTPRO ' + JSON.stringify(notProcessed));    
            let inline = rules.processInlineFunction(jsonObj.Lines,i);
            //console.log('ProcessedJson ' + JSON.stringify(processedJson))
            processedJson.push(inline);
        }
        else if(jsonObj.Lines[i].type == 'variable'){
            console.log('var');
            let variable = rules.processVariables(jsonObj.Lines,i,false);
            if (variable.multi == false){
                processedJson.push(variable);
                //console.log('ProcessedJson ' + JSON.stringify(processedJson))
            } else {
                processedJson.push(variable);
                //console.log('ProcessedJson ' + JSON.stringify(processedJson))
                i = variable.end 
            }
        }
        else if(jsonObj.Lines[i].type == 'variable call'){    
            let varCall = rules.processVarCall(jsonObj.Lines,i);
            console.log('VC ' + JSON.stringify(varCall));
            processedJson.push(varCall);
            //console.log('ProcessedJson ' + JSON.stringify(processedJson))
        }
        else if(jsonObj.Lines[i].type == 'library'){    
            console.log('lib');
            let lib = rules.processLib(jsonObj.Lines,i);
            processedJson.push(lib);
            //console.log('ProcessedJson ' + JSON.stringify(processedJson))
        }
        else if(jsonObj.Lines[i].type == 'exFile'){  
            console.log('exFile');  
            let exFile = rules.processExFile(jsonObj.Lines,i);
            processedJson.push(exFile);
            //console.log('ProcessedJson ' + JSON.stringify(processedJson))
        }
        else if(jsonObj.Lines[i].type == 'sequence'){ 
            console.log('seq');   
            let seq = rules.processSequence(jsonObj.Lines,i);
            processedJson.push(seq);
            //console.log('ProcessedJson ' + JSON.stringify(processedJson))
        }
        console.log('NR ' + numberOfLoopRuns);
        numberOfLoopRuns++;
    //pJ.ProcessNestedCont(contJson);
    }
    //console.log('ProcessedJson ' + (JSON.stringify(processedJson,null,2)))
    return processedJson;
};

pJ.getVarsAndValuesOfLines = function(processedJson){
    console.log(JSON.stringify(processedJson,null,2));
    let varsAndValues = [];
    for (let i = 0; i < processedJson.length;i++){
        if(processedJson[i].type == 'function'){
            console.log('function');
            let start = processedJson[i].Line
            let end = processedJson[i+1].Line - 1
            let vars = []
            let type = processedJson[i].type
            let name = processedJson[i].content.name
            varsAndValues.push({start,end,vars,type,name})
        
        }
        else if(processedJson[i].json.type == 'conditional'){   
            let start = processedJson[i].json.Line
            let end = processedJson[i].end;
            let vars = pJ.getVarsOfCond(processedJson[i].json);
            let type = processedJson[i].json.type
            let name = rules.getContentInBrackets(processedJson[i].json.value)[0]
            varsAndValues.push({start,end,vars,type,name})
            
        }
        else if(processedJson[i].json.type == 'forLoop' || processedJson[i].json.type == 'whileLoop' || processedJson[i].json.type == 'repeatLoop'){    
            console.log('loop');
            
        }
        else if(processedJson[i].json.type == 'inlineFunction'){
            console.log('ILFunction');
           
        }
        else if(processedJson[i].json.type == 'variable'){
            console.log('var');
            let end;
            let start = processedJson[i].json.Line
            if(processedJson[i].multi == false){
            end = processedJson[i].json.Line
            } else {
                end = processedJson[i].end;
            } 
            //let vars = pJ.getVarsOfVariables(processedJson[i].json);
            let type = processedJson[i].json.type
            let name = processedJson[i].json.content[0].variable
            varsAndValues.push({start,end,/** vars, */type,name})
           
        }
        else if(processedJson[i].json.type == 'variable call'){    
            console.log('varCall');
            let start = processedJson[i].json.Line
            let end = processedJson[i].json.Line
            let vars = [processedJson[i].json.content.value]
            let type = processedJson[i].json.type
            let name = processedJson[i].json.content.value
            varsAndValues.push({start,end,vars,type,name})
        }
        else if(processedJson[i].json.type == 'library'){    
            console.log('lib');
            let start = processedJson[i].json.Line
            let end = processedJson[i].json.Line
            let vars = []
            let type = processedJson[i].json.type
            let name = processedJson[i].json.content[0]
            varsAndValues.push({start,end,vars,type,name})
            
            
        }
        else if(processedJson[i].type == 'exFile'){  
            console.log('exFile');  
          
        }
        else if(processedJson[i].type == 'sequence'){ 
            console.log('seq');   
           
        }
    }
    console.log('VARS ' + JSON.stringify(varsAndValues,null,2));
    return varsAndValues;
}

pJ.getVarsOfInlineFunctions = function(LineWithTypeInlineFunction){
    let inlineFunVars = "";
    if(LineWithTypeInlineFunction.indexOf('#') == -1){
        let contentInBrackets = rules.getContentInBrackets(LineWithTypeInlineFunction);
        for(let i = 0; i< contentInBrackets.length; i++){
            if(isNaN(contentInBrackets[i]) == true){
                inlineFunVars =  contentInBrackets[i];
            }   
        }
     } else {
            let contentString = LineWithTypeInlineFunction;
            console.log('contentString');
            console.log(contentString);
            let values = contentString.substring(0,indexOf('#'))
            if(values.indexOf('(') != -1 && values.indexOf(')') != -1){
                let varsInBrackets = rules.getContentInBrackets(values);
                for(let i = 0; i< varsInBrackets.length; i++){
                    if(isNaN(varsInBrackets[i]) == true){
                        inlineFunVars = varsInBrackets[i];
                    }
                }
            }
        }
        return inlineFunVars;
}

pJ.getVarsOfVariables = function(LineWithTypeVariable){
    let vars = [];
    for (let i = 0; i < LineWithTypeVariable.content.length; i++) {
        let variable = LineWithTypeVariable.content[i].variable;
        console.log('LineWithTypeVariable');
        console.log(LineWithTypeVariable);
        if(variable.indexOf('#') != -1){
            let varWithoutComment = variable.substring(0,variable.indexOf('#'))
            vars.push(varWithoutComment);
        } else{
            vars.push(variable);
        }
        if(LineWithTypeVariable.content[i].type == 'inlineFunction'){
            console.log('LineWithTypeVariable.content[i]');
            console.log(LineWithTypeVariable.content[i]);
        let inlineFun = pJ.getVarsOfInlineFunctions(LineWithTypeVariable.content[i].value);
        console.log('inlineFun')
        console.log(inlineFun);
        vars.push(inlineFun);
        } 
        else {
            let contentString = LineWithTypeVariable.content[i].value;
            if(contentString.indexOf('#') == -1){
                if(isNaN(contentString) == true){
                    vars.push(contentString);
                }
            } else {
                let value = contentString.substring(0,contentString.indexOf('#'))
                if(isNaN(value) == true){
                    vars.push(value);
                }
            }

        }
    }
    return vars;
}
//TODO: Finish cond processing
pJ.getVarsOfCond = function (LineWithTypeCond) {
    let vars = [];
    let condVar = rules.getContentInBrackets(LineWithTypeCond.value);
    for(let i = 0; i<condVar.length;i++){
        vars.push(condVar[i]);
    }
    for (let i = 0; i < LineWithTypeCond.content.length; i++) {
        if (LineWithTypeCond.content[i].type == 'variable') {
            let varValue = pJ.getVarsOfVariables(LineWithTypeCond.content[i].value.json);
            console.log('varValue');
            console.log(varValue);
            //vars.push(varValue);

        }
    }
}

//TODO: Add lines to find all plot functions in script --> not needed for now
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
    //console.log('VARS ' + variables);

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