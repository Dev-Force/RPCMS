import http from 'http';
import jwt from 'jsonwebtoken';
import JsonRPCRequest from './json-rpc-request';
import JsonRPCResponse from './json-rpc-response';
import config from '../../../config/config';
import needle from 'needle';


module.exports = class JsonRPCFacade {

    _request;

    constructor(req) {
        this._request = req;
    }
    
    set request(req) {
        this._request = req;
    }

    // Returns Array of promises Or a single Promise
    generateResponse(req = this._request) {
        let response = [];

        // Handle Batch
        if(Array.isArray(req.body)) 
            req.body.forEach((request) => {
                response.push(this._handleJsonRPC(request));
            });
        // Handle single request
        else response = this._handleJsonRPC(req.body);

        console.log(response);
        return response;
    }

    _handleJsonRPC(req) {
        let jsonRPCRequest = new JsonRPCRequest(req);
        let err = jsonRPCRequest.validate();
        let response = {};

        return new Promise((resolve, reject) => {
            if(err) {
                response = new JsonRPCResponse({
                    "jsonrpc": "2.0",
                    "id": jsonRPCRequest.id,
                    "error": err.err // Gets the error object literal
                });
                resolve(response);
            } else {
                needle.request(config.central_system.requestMethod, config.central_system.methodInvocationURL, {}, function(err, resp) {
                    if(err) return reject(Error('Something Went Wrong. Possibly Wrong URL is Provided.'));
                    response = new JsonRPCResponse({
                        "jsonrpc": "2.0",
                        "result": resp.body,
                        "id": jsonRPCRequest.id
                    });
                    // send request using JsonRPCResponse.toJson();
                    // if its notification dont send response
                    if(!jsonRPCRequest.notification) resolve(response.toJson());
                    else resolve(undefined);
                });
            }
        });
        
    }
    
};