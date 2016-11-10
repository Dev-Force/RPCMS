import express from 'express';
import OperationController from '../../controllers/api/operation.controller';
import {IPLimitMiddlewareNode} from '../../middleware/ip-limit.middleware';
import {TokenVerificationMiddlewareNode} from '../../middleware/token-verification.middleware';
import {AdminMiddlewareNode} from  '../../middleware/admin.middleware'
import OrMiddlewareStrategy from '../../utils/middleware/or-middleware-strategy';
import AndMiddlewareStrategy from '../../utils/middleware/and-middleware-strategy';
import MiddlewareChainer from '../../utils/middleware/middleware-chainer';

module.exports = function(app) {

    let operationRouter = express.Router();
    let operationController = new OperationController();
    
    operationRouter.use(function(req, res, next) {
        let orChainer = new MiddlewareChainer(new OrMiddlewareStrategy());
        let andChainer = new MiddlewareChainer(new AndMiddlewareStrategy());

        andChainer.add(new TokenVerificationMiddlewareNode());
        andChainer.add(new AdminMiddlewareNode());
        orChainer.add(andChainer);
        orChainer.add(new IPLimitMiddlewareNode());

        orChainer.execute(req, res, next, app, operationRouter, function(res) {
            res.status(401).json({status: 'Unauthorized'});
        });
    });

    operationRouter.get('/', operationController.index);
    operationRouter.get('/collect', operationController.collect);
    operationRouter.get('/:id', operationController.show);
    operationRouter.post('/', operationController.store);
    operationRouter.put('/:id', operationController.update);
    operationRouter.delete('/', operationController.destroyMass);
    operationRouter.delete('/:id', operationController.destroy);

    app.use('/api/v1/operations', operationRouter);
    
};