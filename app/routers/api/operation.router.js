import express from 'express';
import OperationController from '../../controllers/api/operation.controller';
import IPLimitMiddleware from '../../middleware/ip-limit.middleware';

module.exports = function(app) {

    let operationRouter = express.Router();
    let operationController = new OperationController();

    IPLimitMiddleware(app, operationRouter);

    operationRouter.get('/', operationController.index);
    operationRouter.get('/:id', operationController.show);
    operationRouter.post('/', operationController.store);
    operationRouter.put('/:id', operationController.update);
    operationRouter.delete('/', operationController.destroyMass);
    operationRouter.delete('/:id', operationController.destroy);

    app.use('/api/v1/operations', operationRouter);
    
};