import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let User = mongoose.model('User');

/**
 * 
 * 
 * @class AuthController
 */
class AuthController {

    /**
     * The app secret
     * 
     * 
     * @memberOf AuthController
     */
    static appSecret = null;
    static allowedIPs = null;

    /**
     * Performs the Authentication
     * 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * 
     * @memberOf AuthController
     */
    tokenAuth = (req, res) => {
        // find the user
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) res.json(err);
            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {
                // check if password matches
                if (!user.validPassword(req.body.password)) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({ username: user.username, operations: user.operations, admin: user.admin }, AuthController.appSecret, {
                        expiresIn: '1440m' // expires in 24 hours
                    });
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: token
                    });
                }
            }
        });
    }

    ipAuth = (req, res) => {
        if(AuthController.allowedIPs.indexOf(req.ip) > -1) {
            res.json({success: true});
        } else res.status(401).json({success: false});
    }
    
}

module.exports = AuthController;
