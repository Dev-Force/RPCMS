import express from 'express';
import OperationUIController from '../../controllers/ui/operation-ui.controller';
import IPLimitMiddleware from '../../middleware/ip-limit.middleware';

module.exports = function(app) {

    let operationUIRouter = express.Router();
    let operationUIController = new OperationUIController();

    IPLimitMiddleware(app, operationUIRouter);

    operationUIRouter.get('/', operationUIController.index);
    operationUIRouter.get('/create', operationUIController.create);
    operationUIRouter.get('/edit/:id', operationUIController.edit);
    operationUIRouter.get('/:id', operationUIController.show);

    app.use('/operations', operationUIRouter);

};