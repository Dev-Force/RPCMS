
class JsonRPCError {

    _err;

    static PARSE_ERROR = { code: -32700, message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.' };
    static INVALID_REQUEST = { code: -32600, message: 'The JSON sent is not a valid Request object.' };
    static METHOD_NOT_FOUND = { code: -32601, mesage: 'The method does not exist / is not available.' };
    static INVALID_PARAMS = { code: -32602, message: 'Invalid method parameter(s).' };
    static INTERNAL_ERROR = { code: -32603, message: 'Internal JSON-RPC error.' };
    static SERVER_ERROR = Array(100).fill().map((x,i) => { 
        let k = i - 32000;
        return { code: k, message: 'Reserved for implementation-defined server-errors.' };
    });

    get err() {
        return this._err;
    }

    constructor(err) {
        this._err = err;
    }

}

module.exports = JsonRPCError;