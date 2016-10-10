
/**
 * 
 * 
 * @class JsonRPCResponse
 */
class JsonRPCResponse {
    
    _jsonrpc;
    _err;
    _result;
    _id;

    /**
     * Creates an instance of JsonRPCResponse.
     * 
     * @param {any} args
     * 
     * @memberOf JsonRPCResponse
     */
    constructor(args) {
        this._jsonrpc = args.jsonrpc || '2.0';
        this._err = args.error;
        this._result = args.result;
        this._id = args.id;
    }

    /**
     * When everything is ok call this method
     * 
     * @param {any} data
     * 
     * @memberOf JsonRPCResponse
     */
    success(data) {
        this._err = undefined;
        this._result = data;
    }
    
    /**
     * When an error happens call this method
     * 
     * @param {any} errr
     * 
     * @memberOf JsonRPCResponse
     */
    err(errr) {
        this._result = undefined;
        this._err = errr;
        this._id = null;
    }

    /**
     * Returns a representation of a JsonRPCResponse
     * 
     * @returns {Object}
     * 
     * @memberOf JsonRPCResponse
     */
    toJson() {
        return {
            'jsonrpc': this._jsonrpc,
            'result': this._result,
            'error': this._err,
            'id': this._id
        };
    }

}

module.exports = JsonRPCResponse;

