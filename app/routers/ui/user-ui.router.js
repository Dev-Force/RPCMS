import express from 'express';
import UserUIController from '../../controllers/ui/user-ui.controller';
import IPLimitMiddleware from '../../middleware/ip-limit.middleware';

module.exports = function(app) {

    let userUIRouter = express.Router();
    let userUIController = new UserUIController();

    IPLimitMiddleware(app, userUIRouter);

    userUIRouter.get('/', userUIController.index);
    userUIRouter.get('/create', userUIController.create);
    userUIRouter.get('/edit/:id', userUIController.edit);
    userUIRouter.get('/:id', userUIController.show);

    app.use('/users', userUIRouter);

};