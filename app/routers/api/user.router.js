import express from 'express';
import UserController from '../../controllers/api/user.controller';
import IPLimitMiddleware from '../../middleware/ip-limit.middleware';

module.exports = function(app) {

    let userRouter = express.Router();
    let userController = new UserController();

    IPLimitMiddleware(app, userRouter);

    userRouter.get('/', userController.index);
    userRouter.get('/:id', userController.show);
    userRouter.post('/', userController.store);
    userRouter.put('/:id', userController.update);
    userRouter.delete('/', userController.destroyMass);
    userRouter.delete('/:id', userController.destroy);
    
    

    app.use('/api/v1/users', userRouter);

};