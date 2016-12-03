import JsonRPCError from './json-rpc-error';
import OperationDao from '../../dao/operation.dao';

/**
 * 
 * 
 * @class JsonRPCRequest
 */
export default class JsonRPCRequest {

    _req;
    _jsonrpc;
    _id;
    _method;
    _params;
    _notification = false;
    _externalUrl = null;
    _requestMethod = null;

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
        this._req = args.req;
        if(this._id === undefined || this._id === null) this._notification = true;
    }

    get requestMethod() {
        return this._requestMethod;
    }

    get externalUrl() {
        return this._externalUrl;
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
            // Invalid params (both positional and named) 

            return resolve(this._operationDao.getByName(this._method));
        }).then(operation => {
            this._requestMethod = operation.requestMethod;

            // If the operations has externalUrl set external to true
            if(operation.externalUrl) {
                this._externalUrl = operation.externalUrl;
                this._requestMethod = operation.requestMethod;
            }

            // Check if user is authorized to execute the specific operation
            if(!this._req.decoded.operations.some(function(op) {
                return operation._id.equals(op);
            })) return Promise.reject(new JsonRPCError(JsonRPCError.INTERNAL_ERROR));
          
            // If there is a token in the operation and is located inside the params then decrease the param number by one
            let namedParamsKeys = operation.namedParams.length;
            if(operation.tokenInParams) namedParamsKeys--;

            // Check if parameters match remote procedure's. Error METHOD_NOT_FOUND
            if(
                (
                    Object.prototype.toString.call(this._params) === '[object Object]'
                    &&
                    namedParamsKeys !== Object.keys(this._params).length
                )
                ||
                (
                    Array.isArray(this._params)
                    &&
                    operation.positionalNumOfParams !== this._params.length // There is a problem when namedParams are set on the operation but the request doesnt contain any params
                )
            ) return Promise.reject(new JsonRPCError(JsonRPCError.METHOD_NOT_FOUND));

            // Resolve the above problem when namedParams are set on the operation but the request doesnt contain any params
            if(
                namedParamsKeys !== 0 
                &&
                (
                    this._params == null
                    ||
                    (
                        Array.isArray(this._params)
                        &&
                        this._params.length === 0
                    )
                )
            ) return Promise.reject(new JsonRPCError(JsonRPCError.METHOD_NOT_FOUND));

            return Promise.resolve();
        }).catch(err => { // Catch is possibly useless
            return Promise.reject(err);
        });
    }
    
}
