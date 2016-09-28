
class JsonRPCResponse {
    
    _jsonrpc;
    _err;
    _result;
    _id;

    constructor(args) {
        this._jsonrpc = args.jsonrpc || '2.0';
        this._err = args.error;
        this._result = args.result;
        this._id = args.id;
    }

    success(data) {
        this._err = undefined;
        this._result = data;
    }
    
    err(errr) {
        this._result = undefined;
        this._err = errr;
        this._id = null;
    }

    toJson() {
        return {
            jsonrpc: this._jsonrpc,
            result: this._result,
            error: this._err,
            id: this._id
        };
    }

}

module.exports = JsonRPCResponse;

