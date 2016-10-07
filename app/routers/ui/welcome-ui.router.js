import express from 'express';
import WelcomeUIController from '../../controllers/ui/welcome-ui.controller';
import IPLimitMiddleware from '../../middleware/ip-limit.middleware'

module.exports = function(app) {

    let welcomeRouter = express.Router();
    let welcomeUIController = new WelcomeUIController();

    IPLimitMiddleware(app, welcomeRouter);

    welcomeRouter.get('/', welcomeUIController.welcomeMessage);

    app.use('/', welcomeRouter);

};