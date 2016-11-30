import express from 'express';
import JsonRPCController from '../../controllers/api/json-rpc.controller';
import {TokenVerificationMiddleware} from '../../middleware/token-verification.middleware';

export default function(app) {

    let jsonRPCRouter = express.Router();
    let tokenVerificationMiddleware = new TokenVerificationMiddleware();

    jsonRPCRouter.use(tokenVerificationMiddleware.applyMiddleware(app));
    
    jsonRPCRouter.post('/', JsonRPCController.handleJsonRPC);
    

    app.use('/api/v1/json-rpc', jsonRPCRouter);
};
