import express from 'express';
import UserController from '~/controllers/api/user.controller';
import {IPLimitMiddleware} from '~/middleware/ip-limit.middleware';

export default function(app) {

    let userRouter = express.Router();
    let userController = new UserController();
    let ipLimitMiddleware = new IPLimitMiddleware();

    userRouter.use(ipLimitMiddleware.applyMiddleware(app));

    userRouter.get('/', userController.index());
    userRouter.get('/:id', userController.show());
    userRouter.post('/', userController.store());
    userRouter.put('/:id', userController.update());
    userRouter.post('/destroyMass', userController.destroyMass());
    userRouter.delete('/:id', userController.destroy());

    app.use('/api/v1/users', userRouter);

};