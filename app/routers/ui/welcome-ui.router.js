import express from 'express';
import WelcomeController from '../../controllers/ui/welcome-ui.controller';
import IPLimitMiddleware from '../../middleware/ip-limit.middleware'

module.exports = function(app) {

    let welcomeRouter = express.Router();

    IPLimitMiddleware(app, welcomeRouter);

    welcomeRouter.get('/', WelcomeController.welcomeMessage);

    app.use('/', welcomeRouter);

};