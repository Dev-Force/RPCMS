import mongoose from 'mongoose';

/**
 * Auth Controller
 * 
 * @class AuthUIController
 */
class AuthUIController {

    /**
     * Shows the login screen
     * 
     * @memberOf AuthUIController
     */
    index = (req, res) => {
        res.render('auth/index', { });
    }

}

module.exports = AuthUIController;