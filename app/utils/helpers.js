
/**
 * Check for existence of args key inside defaults.
 * If there is any, inject it
 * 
 * @param {any} toBeChanged
 * @param {any} toInject
 * @returns {*}
 */
exports.mergeObjects = function(toBeChanged, toInject) {
    if (toInject != null) {
        for (let d in toBeChanged) {
            if (d in toInject) {
                toBeChanged[d] = toInject[d];
            }
        }
    }
    return toBeChanged;
}

/**
 * Make all args, instance variables
 * @param args
 */
exports.setupInstanceVars = function(args) {
    for (let a in args) {
        this[a] = args[a];
    }
}

/**
 * Combine setupInstanceVars and mergeObjects functions
 * and set availableArgs as instance variable
 * @param toBeChanged
 * @param toInject
 */
exports.mergeAndSetupInstanceVars = function(toBeChanged, toInject) {
    this[toBeChanged] = mergeObjects(this[toBeChanged], toInject);
    setupInstanceVars.call(this, this[toBeChanged]);
}

/**
 * Convert an array to dictionary
 * @param arr
 * @returns {{}}
 */
exports.objectArrayToDict = function(arr) {
    let dict = {};
    arr.forEach((item) => {
        dict[item] = this[item];
    });
    return dict;
}
