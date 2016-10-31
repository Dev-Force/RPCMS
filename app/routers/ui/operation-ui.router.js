import express from 'express';
import OperationUIController from '../../controllers/ui/operation-ui.controller';
import {IPLimitMiddlewareNode} from '../../middleware/ip-limit.middleware';
import {TokenVerificationMiddlewareNode} from '../../middleware/token-verification.middleware';
import {AdminMiddlewareNode} from  '../../middleware/admin.middleware';
import OrMiddlewareStrategy from '../../utils/middleware/or-middleware-strategy';
import AndMiddlewareStrategy from '../../utils/middleware/and-middleware-strategy';
import MiddlewareChainer from '../../utils/middleware/middleware-chainer';

module.exports = function(app) {

    let operationUIRouter = express.Router();
    let operationUIController = new OperationUIController();

    operationUIRouter.use(function(req, res, next) {
        let orChainer = new MiddlewareChainer(new OrMiddlewareStrategy());
        let andChainer = new MiddlewareChainer(new AndMiddlewareStrategy());

        andChainer.add(new TokenVerificationMiddlewareNode());
        andChainer.add(new AdminMiddlewareNode());
        orChainer.add(andChainer);
        orChainer.add(new IPLimitMiddlewareNode());

        orChainer.execute(req, res, next, app, operationUIRouter, function(res) {
            res.status(401).json({status: 'Unauthorized'});
        });
    });
    
    operationUIRouter.get('/', operationUIController.index);
    operationUIRouter.get('/create', operationUIController.create);
    operationUIRouter.get('/edit/:id', operationUIController.edit);
    operationUIRouter.get('/:id', operationUIController.show);

    app.use('/operations', operationUIRouter);

};