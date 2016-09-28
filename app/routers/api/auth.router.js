import express from 'express';
import AuthController from '../../controllers/api/auth.controller';

module.exports = function (app) {

    AuthController.appSecret = app.get('secret');

    let authRouter = express.Router();
    let authController = new AuthController();
    authRouter.post('/authentication', authController.auth);
    
    app.use('/api/v1/auth', authRouter);
};