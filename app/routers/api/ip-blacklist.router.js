import express from 'express';
import IPBlacklistController from '~/controllers/api/ip-blacklist.controller';
import {IPLimitMiddleware} from '~/middleware/ip-limit.middleware';

export default function (app) {

    let ipBlacklistRouter = express.Router();
    let ipBlacklistController = new IPBlacklistController();

    let ipLimitMiddleware = new IPLimitMiddleware();

    ipBlacklistRouter.use(ipLimitMiddleware.applyMiddleware(app));

    ipBlacklistRouter.get('/', ipBlacklistController.index());
    ipBlacklistRouter.get('/:id', ipBlacklistController.show());
    ipBlacklistRouter.post('/', ipBlacklistController.store());
    ipBlacklistRouter.put('/:id', ipBlacklistController.update());
    ipBlacklistRouter.post('/destroyMass', ipBlacklistController.destroyMass());
    ipBlacklistRouter.delete('/:id', ipBlacklistController.destroy());

    app.use('/api/v1/ipblacklist', ipBlacklistRouter);
    
};