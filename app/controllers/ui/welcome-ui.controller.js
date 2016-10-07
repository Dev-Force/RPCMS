import OperationDao from '../../dao/operation.dao';

module.exports = class WelcomeController {
    
    /**
     * Shows the Welcome Dashboard
     * 
     * @static
     * @param {any} req
     * @param {any} res
     */
    welcomeMessage = (req, res) => {
        res.render('welcome', {
            title: 'Welcome'
        });
    }
    
};