
/**
 * 
 * 
 * @class JsonRPCError
 */
class JsonRPCError {

    _err;

    /**
     * Parse Error 
     * 
     * @static
     * 
     * @memberOf JsonRPCError
     */
    static PARSE_ERROR = { code: -32700, message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.' };

    /**
     * Invalid Request
     * 
     * @static
     * 
     * @memberOf JsonRPCError
     */
    static INVALID_REQUEST = { code: -32600, message: 'The JSON sent is not a valid Request object.' };

    /**
     * Method Not Found
     * 
     * @static
     * 
     * @memberOf JsonRPCError
     */
    static METHOD_NOT_FOUND = { code: -32601, mesage: 'The method does not exist / is not available.' };

    /**
     * Invalid Params
     * 
     * @static
     * 
     * @memberOf JsonRPCError
     */
    static INVALID_PARAMS = { code: -32602, message: 'Invalid method parameter(s).' };

    /**
     * Internal Error
     * 
     * @static
     * 
     * @memberOf JsonRPCError
     */
    static INTERNAL_ERROR = { code: -32603, message: 'Internal JSON-RPC error.' };

    /**
     * Server Error
     * 
     * @static
     * 
     * @memberOf JsonRPCError
     */
    static SERVER_ERROR = Array(100).fill().map((x,i) => { 
        let k = i - 32000;
        return { code: k, message: 'Reserved for implementation-defined server-errors.' };
    });

    /**
     * Error Getter
     * 
     * @readonly
     * 
     * @memberOf JsonRPCError
     */
    get err() {
        return this._err;
    }

    /**
     * Creates an instance of JsonRPCError.
     * 
     * @param {any} err
     * 
     * @memberOf JsonRPCError
     */
    constructor(err) {
        this._err = err;
    }

}

module.exports = JsonRPCError;