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
    for(let i=1;i<file.length;i++){
        if(variable(file[i])) {
            //TODO processVariable(file[i]);
            console.log('variable found in line ' + i + ' : ' + file[i]);
        } else if(fun(file[i])) {
            //TODO processFunction(file[i]);
            console.log('function found in line ' + i + ' : ' + file[i]);
        } else if(inlineFunction(file[i])) {
            //TODO processInlineFunction(file[i]);
            console.log('inlineFunction found in line ' + i + ' : ' + file[i]);
        } else if(lib(file[i])) {
            //TODO processLibrary(file[i]);
            console.log('library found in line ' + i + ' : ' + file[i]);
        } else if (loop(file[i]) === true) {
            //TODO processloop(file[i]);
            console.log('loop found in line ' + i + ' : ' + file[i]);
        } else{
                //console.log("Unable to detect type in line " + i + "!");
                console.log();
        }

    }
};


//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;
    if(isFunction.test(content)){
        return(true);
    }
};

module.exports = areYou;









