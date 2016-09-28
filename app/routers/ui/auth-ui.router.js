import express from 'express';
import AuthUIController from '../../controllers/ui/auth-ui.controller';

module.exports = function(app) {

    let authUIRouter = express.Router();
    let authUIController = new AuthUIController();

    authUIRouter.get('/', authUIController.index);

    app.use('/auth', authUIRouter);

};