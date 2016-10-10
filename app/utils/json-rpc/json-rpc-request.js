import JsonRPCError from './json-rpc-error';
import OperationDao from '../../dao/operation.dao';

/**
 * 
 * 
 * @class JsonRPCRequest
 */
class JsonRPCRequest {

    _req;
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
        this._operationDao = new OperationDao();
        this._jsonrpc = args.jsonrpc;
        this._method = args.method;
        this._params = args.params || [];
        this._id = args.id;
        this._req= args.req;
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
     * @memberOf JsonRPCRequest
     * 
     * @returns {Promise}
     */
    validate() {
        return new Promise((resolve, reject) => { 
            // Validate json format
            if(this._jsonrpc !== '2.0') 
                return reject(new JsonRPCError(JsonRPCError.INVALID_REQUEST)); // Check if its the correct version
            if(this._method == null) 
                return reject(new JsonRPCError(JsonRPCError.INVALID_REQUEST)); // check if there is "method" on request body
            if(this._params != null && (!Array.isArray(this._params) && !(typeof this._params === "object"))) 
                return reject(new JsonRPCError(JsonRPCError.INVALID_PARAMS));// Validate that Parameters are either array or object literal
            // Validate that parameters match remote procedure's. Error METHOD_NOT_FOUND
            return resolve(this._operationDao.getByName(this._method));

        }).then(operation => {
            if(!this._req.decoded.operations.some(function(op) {
                return operation._id.equals(op);
            })) return Promise.reject(new JsonRPCError(JsonRPCError.INTERNAL_ERROR));
            return Promise.resolve();
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    
}

module.exports = JsonRPCRequest;