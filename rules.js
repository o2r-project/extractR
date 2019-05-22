let areYou = {};


const variable = function (content) {
    //Test for variable of form v = x or v <- x
    const isVariable1 = /.*?=(.*)/g;
    const isVariable2 = /.*?<-(.*)/g;

    if (isVariable1.test(content) || isVariable2.test(content)){
        return(true);
    } else {
        return false;
    }

};

const loop = function (content) {
    const isLoop = /(?:for)|(?:while)|(?:repeat)/g;

    if (isLoop.test(content) == true){
        return(true);
    } else {
        return false;
    }
};

const fun = function (content) {
    const isFunction = /(?:function)/g;

    if (isFunction.test(content)== true){
        return(true);
    } else {
        return false;
    }
};

const lib = function (content) {
    const isLibrary = /(?:library)/g;

    if (isLibrary.test(content) == true){
        return(true);
    } else {
        return false;
    }
};

const inlineFunction = function (content) {
    const isInlineFunction = findFunctions(content);
    if (isInlineFunction == true) {
        return(true);
    } else {
        return false;
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
            console.log('library found in line ' +  ' : ' + file[i]);
            type = 'library';
        } else if (loop(file)) {
            //TODO processloop(file[i]);
            console.log('loop found in line ' + ' : ' + file[i]);
            type = 'loop';
        } else{
                //console.log("Unable to detect type in line " + i + "!");
                console.log();
        }
        return type;
};




//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;
    if(isFunction.test(content)){
        return(true);
    }
};

module.exports = areYou;









