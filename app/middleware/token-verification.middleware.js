import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Access Decoded Data through req.decoded


export class TokenVerificationMiddlewareNode {

    applyMiddleware() {
        return (req, res, next) => {
            return new Promise((resolve, reject) => {
                // check header or url parameters or post parameters for token
                // var token = req.body.token || req.query.token || req.headers['x-access-token'];
                var token = req.headers['authorization'].split(' ')[1];
                    
                if(!token) {
                    // if there is no token
                    // return an error
                    return reject({ 
                        success: false, 
                        message: 'No token provided.' 
                    });
                }

                // verifies secret and checks exp
                jwt.verify(token, req.app.get('secret'), (err, decoded) => { 
                    if(err) return reject({ success: false, message: 'Failed to authenticate token.' });
                    else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;

                        // Check if username Exists (token invalidation)
                        // Find user with username decoded.username in DB
                        // Check if result is null and if it is, return unauthorized
                        // Else proceed with next router
                        // TODO: User in-memory key value data in order to invalidate token instead
                        //      of hitting the DB at every request
                        let User = mongoose.model('User');
                        User.findOne({ username: decoded.username }, (err, user) => {
                            if(err) return reject(err);
                            if(user === null) return reject({
                                status: 'Unauthorized'
                            });

                            // Check if the token payload matches the user model
                            if(
                                ( // same length and same values
                                    decoded.operations.length === user.operations.length
                                    && 
                                    user.operations.every((op_id, i) => op_id.equals(decoded.operations[i].user_id))
                                )
                                ||
                                decoded.username != user.username
                                ||
                                decoded.admin != user.admin
                                ||
                                decoded.user_id != user._id
                            ) return reject({ // If it doesnt return unauthorized (close to token invalidation)
                                status: 'Unauthorized'
                            });


                            if((decoded.operations.length == user.operations.length) && decoded.operations.every(function(element, index) {
                                    return element === user.operations[index]; 
                                })
                            ) return reject({
                                status: 'Unauthorized'
                            });
                            return resolve(user);
                        });
                    }
                });
            });
        }
    }
    
}

export class TokenVerificationMiddleware {

    applyMiddleware() {
        return (req, res, next) => {
            // check header or url parameters or post parameters for token
            // var token = req.body.token || req.query.token || req.headers['x-access-token'];
            var token = req.headers['authorization'].split(' ')[1];

            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, req.app.get('secret'), (err, decoded) => { 
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
                        new Promise((resolve, reject) => {
                            User.findOne({ username: decoded.username }, (err, user) => {
                                if(err) return reject(err);
                                if(user === null) return reject({
                                    status: 'Unauthorized'
                                });
                                if((decoded.operations.length == user.operations.length) && decoded.operations.every(function(element, index) {
                                        return element === user.operations[index]; 
                                    })
                                ) return reject({
                                    status: 'Unauthorized'
                                });
                                return resolve();
                            });
                        }).then((user) => {
                            next();
                        }).catch((err) => {
                            res.status(401).json(err);
                        });
                    }
                });
            } else {
                // if there is no token
                // return an error
                return res.status(401).json({ 
                    success: false, 
                    message: 'No token provided.' 
                });
            }
        };
    }

}
