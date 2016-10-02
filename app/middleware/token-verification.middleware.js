import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


// Access Decoded Data through req.decoded

/**
 * Restricts Access to requests that contain a valid json web token
 * 
 * @param {any} app
 * @param {any} [router]
 * @returns
 */
module.exports = function(app, router) {

    if(router === undefined) router = app;
  
    router.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('secret'), function(err, decoded) { 
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    // Check if username Exists (token invalidation)
                    // Find user with username decoded.username in DB
                    // Check if result is null and if it is, return unauthorized
                    // Else proceed with next router
                    // TODO: User in-memory key value data in order to invalidate token instead
                    //      of hitting the DB at every request
                    let User = mongoose.model('User');
                    new Promise(function(resolve, reject) {
                        User.findOne({ username: decoded.username }, function(err, user) {
                            if(err) return reject(err);
                            if(user === null) return reject({
                                status: 'Unauthorized'
                            });
                            return resolve();
                        });
                    }).then(function(user) {
                        next();
                    }).catch(function(err) {
                        res.status(401).json(err);
                    });
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(401).send({ 
                success: false, 
                message: 'No token provided.' 
            });
            
        }
    });

    return router;
    
};