import express from 'express';
import JsonRPCController from '~/controllers/api/json-rpc.controller';
import {TokenVerificationMiddleware} from '~/middleware/token-verification.middleware';
import {RateLimiterMiddleware} from '~/middleware/rate-limiter.middleware';
import {IPBlacklistMiddleware} from '~/middleware/ip-blacklist.middleware';

export default function(app) {

    let jsonRPCRouter = express.Router();
    let tokenVerificationMiddleware = new TokenVerificationMiddleware();
    let rateLimiterMiddleware = new RateLimiterMiddleware();
    let jsonRPCController = new JsonRPCController();
    let ipBlacklistMiddleware = new IPBlacklistMiddleware();

    jsonRPCRouter.post('/', ipBlacklistMiddleware.applyMiddleware());
    jsonRPCRouter.post('/', tokenVerificationMiddleware.applyMiddleware());
    jsonRPCRouter.post('/', rateLimiterMiddleware.applyMiddleware());
    
    jsonRPCRouter.post('/', jsonRPCController.handleJsonRPC());
    
    app.use('/api/v1/json-rpc', jsonRPCRouter);
    
};
