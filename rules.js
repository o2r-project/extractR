let areYou = {};


const variable = function (content) {
    //Test for variable of form v = x or v <- x
    const isVariable1 = /.*?=(.*)/;
    const isVariable2 = /.*?<-(.*)/;

    if (!fun(content) && (isVariable1.test(content) || isVariable2.test(content))){
        return isVariable1;
    }

};

const loop = function (content) {
    const isLoop = /(?:for)|(?:while)|(?:repeat)/;

    if (isLoop.test(content) == true) {
        return isLoop;
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



areYou.findType = function (file) {
    let type = '';
        if(variable(file)) {
            //TODO processVariable(file[i]);
            console.log('variable found in line ' + ' : ' + file);
            type = 'variable';
        } else if(fun(file)) {
            //TODO processFunction(file[i]);
            console.log('function found in line ' + ' : ' + file);
            type = 'function';
        } else if(inlineFunction(file)) {
            //TODO processInlineFunction(file[i]);
            console.log('inlineFunction found in line '  + ' : ' + file);
            type = 'inlineFunction';
        } else if(lib(file)) {
            //TODO processLibrary(file[i]);
            console.log('library found in line ' +  ' : ' + file);
            type = 'library';
        } else if (loop(file)) {
            //TODO processloop(file[i]);
            console.log('loop found in line ' + ' : ' + file);
            type = 'loop';
        }
        else if (variableCall(file)) {
            //TODO processloop(file[i]);
            console.log('variable call found in line ' + ' : ' + file);
            type = 'variable call';
        }else{
                //console.log("Unable to detect type in line " + i + "!");
                console.log();
        }
        return type;
};




//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;

    if(!loop(content)){
        if (isFunction.test(content)) {
            return true;
        }
    }
};

module.exports = areYou;









