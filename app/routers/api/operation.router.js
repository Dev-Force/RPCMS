import express from 'express';
import OperationController from '../../controllers/api/operation.controller';
import {IPLimitMiddlewareNode} from '../../middleware/ip-limit.middleware';
import {TokenVerificationMiddlewareNode} from '../../middleware/token-verification.middleware';
import {AdminMiddleware, AdminMiddlewareNode} from  '../../middleware/admin.middleware';
import {conditionalMiddleware, AndMiddlewareStrategy, OrMiddlewareStrategy, MiddlewareChainer} from 'express-conditional-tree-middleware';

export default function(app) {

    let operationRouter = express.Router();
    let operationController = new OperationController();

    let adminMiddleware = new AdminMiddleware();

    let orChainer = new MiddlewareChainer(new OrMiddlewareStrategy());
    let andChainer = new MiddlewareChainer(new AndMiddlewareStrategy());

    // andChainer.add(new TokenVerificationMiddlewareNode());
    // andChainer.add(new AdminMiddlewareNode());
    // orChainer.add(andChainer);
    orChainer.add(new TokenVerificationMiddlewareNode()); // new
    orChainer.add(new IPLimitMiddlewareNode());

    operationRouter.use(
        conditionalMiddleware(app, operationRouter, orChainer, function(res) {
            res.status(401).json({status: 'Unauthorized'});
        })
    );
    
    operationRouter.get('/', operationController.index);
    operationRouter.get('/authorizedCRUD', operationController.indexAuthorized);

    // CRUD
    operationRouter.use(adminMiddleware.applyMiddleware(app));

    operationRouter.get('/collect', operationController.collect);
    operationRouter.get('/:id', operationController.show);
    operationRouter.post('/', operationController.store);
    operationRouter.put('/:id', operationController.update);
    operationRouter.post('/deleteMass', operationController.destroyMass);
    operationRouter.delete('/:id', operationController.destroy);

    app.use('/api/v1/operations', operationRouter);
    
};