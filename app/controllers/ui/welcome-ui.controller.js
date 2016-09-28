import OperationDao from '../../dao/operation.dao';

module.exports = class WelcomeController {
    
    static welcomeMessage(req, res) {
        res.render('welcome', {
            title: 'Welcome'
        });
    }
    
};