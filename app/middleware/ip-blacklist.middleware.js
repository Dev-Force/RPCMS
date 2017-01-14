import Promise from 'bluebird';
import mongoose from 'mongoose';

let IPBlacklist = mongoose.model('IPBlacklist');

/**
 * Restricts Access to the specified router (or application if no
 * router is specified) to the IPs that are only allowed from config
 *
 * @param {any} app
 * @param {any} [router]
 */

export class IPBlacklistMiddleware {

    applyMiddleware() {
        return (req, res, next) => {
            IPBlacklist.findOne({'address': req.ip}, (err, ip) => {
                if(err) console.log(err);
                if(ip != null) res.status(403).json({status: 'Forbidden'});
                else next();
            });
        };
    }

}
