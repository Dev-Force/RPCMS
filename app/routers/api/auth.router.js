import express from 'express';
import AuthController from '../../controllers/api/auth.controller';

module.exports = function (app) {

    AuthController.appSecret = app.get('secret');
    AuthController.allowedIPs = app.get('allowedIPs');

    let authRouter = express.Router();
    let authController = new AuthController();
    authRouter.post('/token', authController.tokenAuth);
    authRouter.post('/ip', authController.ipAuth);
    
    app.use('/api/v1/auth', authRouter);
};