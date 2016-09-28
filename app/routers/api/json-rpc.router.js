import express from 'express';
import JsonRPCController from '../../controllers/api/json-rpc.controller';
import TokenVerificationMiddleware from '../../middleware/token-verification.middleware';

module.exports = function(app) {

    let jsonRPCRouter = express.Router();

    TokenVerificationMiddleware(app, jsonRPCRouter);

    // jsonRPC.get('/', JsonRPCController.handleJsonRPC);
    jsonRPCRouter.post('/', JsonRPCController.handleJsonRPC);
    

    app.use('/api/v1/json-rpc', jsonRPCRouter);
};
