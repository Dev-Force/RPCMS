import JsonRPCError from './json-rpc-error';

/**
 * 
 * 
 * @class JsonRPCRequest
 */
class JsonRPCRequest {

    _jsonrpc;
    _id;
    _method;
    _params;
    _notification = false;

    /**
     * Creates an instance of JsonRPCRequest.
     * 
     * @param {any} args
     * 
     * @memberOf JsonRPCRequest
     */
    constructor(args) {
        this._jsonrpc = args.jsonrpc;
        this._method = args.method;
        this._params = args.params || [];
        this._id = args.id;
        if(this._id === null || this._id === undefined) this._notification = true;
    }

    /**
     * Notification Getter
     * 
     * @readonly
     * 
     * @memberOf JsonRPCRequest
     */
    get notification() {
        return this._notification;
    }

    /**
     * ID Getter
     * 
     * @readonly
     * 
     * @memberOf JsonRPCRequest
     */
    get id() {
        return this._id;
    }

    /**
     * Method Getter
     * 
     * @readonly
     * 
     * @memberOf JsonRPCRequest
     */
    get method() {
        return this._method;
    }

    /**
     * Params Getter
     * 
     * @readonly
     * 
     * @memberOf JsonRPCRequest
     */
    get params() {
        return this._params;
    }

    /**
     * Validates a JsonRPCRequest
     * 
     * @returns {any} Either error or null
     * 
     * @memberOf JsonRPCRequest
     */
    validate() {
        // Validate json format
        if(this._jsonrpc !== '2.0') 
            return new JsonRPCError(JsonRPCError.INVALID_REQUEST); // Check if its the correct version
        if(this._method == null) 
            return new JsonRPCError(JsonRPCError.INVALID_REQUEST); // check if there is 
        if(this._params != null && (!Array.isArray(this._params) && !(typeof this._params === "object"))) 
            return new JsonRPCError(JsonRPCError.INVALID_PARAMS);// Validate that Parameters are either array or object literal
        // Validate that parameters match remote procedure's. Error METHOD_NOT_FOUND
        

        return null;
    }
    
}

module.exports = JsonRPCRequest;