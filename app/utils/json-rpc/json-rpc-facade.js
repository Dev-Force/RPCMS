import Promise from 'bluebird';
import http from 'http';
import jwt from 'jsonwebtoken';
import JsonRPCRequest from './json-rpc-request';
import JsonRPCResponse from './json-rpc-response';
import JsonRPCError from './json-rpc-error';
import config from '../../../config/config';
import needle from 'needle';
import OperationDao from '../../dao/operation.dao';


class JsonRPCFacade {

    _request;
    _operationDao;

    /**
     * Creates an instance of JsonRPCFacade.
     * 
     * @param {any} req
     */
    constructor(req) {
        this._request = req;
        this._operationDao = new OperationDao();
    }
    
    /**
     * Request Setter
     */
    set request(req) {
        this._request = req;
    }

    /**
     * Generates a JsonRPC Response
     * 
     * @param {any} [req=this._request]
     * @returns {Promise | [Promise]}
     */
    generateResponse(req = this._request) {
        let response = [];

        // Handle Batch
        if(Array.isArray(req.body)) {
            req.body.forEach((rpc_body) => {
                response.push(this._handleJsonRPC(req, rpc_body));
            });
        } else { // Handle single request
            response = this._handleJsonRPC(req, req.body);
        }
        
        // Promise or array of promises
        return response;
    }

    /**
     * Handles all JsonRPC calls
     * 
     * @param {any} req
     * @returns {Promise}
     */
    _handleJsonRPC(req, rpc_body) {
        rpc_body['req'] = req;
        let response = {};
        let jsonRPCRequest = new JsonRPCRequest(rpc_body);
        delete rpc_body['req']; // If we dont delete, it throws RangeError cause req object is too big

        return jsonRPCRequest.validate().then(function(operation) {
            return new Promise((resolve, reject) => {
                let url = config.central_system.methodInvocation.URL;
                let requestMethod = config.central_system.methodInvocation.requestMethod;
                
                if(jsonRPCRequest.externalUrl) url = jsonRPCRequest.externalUrl;
                if(jsonRPCRequest.requestMethod) requestMethod = jsonRPCRequest.requestMethod;

                needle.request(requestMethod, url, JSON.stringify(rpc_body), config.central_system.methodInvocation.options, function(err, resp) { 
                    if(err) return reject(Error('Something Went Wrong. Possibly Wrong URL is Provided.'));

                    if(jsonRPCRequest.externalUrl) response = new JsonRPCResponse(resp.body);
                    else response = new JsonRPCResponse({
                        "jsonrpc": "2.0",
                        "result": resp.body,
                        "id": jsonRPCRequest.id
                    });

                    // send request using JsonRPCResponse.toJson();
                    // if its notification dont send response
                    if(!jsonRPCRequest.notification) return resolve(response.toJson());
                    else return resolve(undefined);
                });
            });
        }).catch(function(err) {

            // console.log(err.stack); // For debugging

            // operationDao can reject with the response 'No Documents Found'
            // we should return a jsonRPCError instead
            if(err === 'No Documents Found') {
                err = new JsonRPCError(JsonRPCError.METHOD_NOT_FOUND);
            }
            
            response = new JsonRPCResponse({
                "jsonrpc": "2.0",
                "id": jsonRPCRequest.id,
                "error": err.err // Gets the error object literal
            });
            return Promise.resolve(response.toJson());
        });
        
    }
    
}

module.exports = JsonRPCFacade;
