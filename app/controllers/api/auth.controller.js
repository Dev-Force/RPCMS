import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let User = mongoose.model('User');

module.exports = class AuthController {

    appSecret = null;

    auth = (req, res) => {
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
                    var token = jwt.sign({ username: user.username }, AuthController.appSecret, {
                        expiresIn: '1440m' // expires in 24 hours
                    });
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    }
    
};

