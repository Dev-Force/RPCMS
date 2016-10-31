import Promise from 'bluebird';

/**
 * Restricts Access to the specified router or application if no
 * router is specified, to the IPs that are only allowed from config
 * 
 * @param {any} app
 * @param {any} [router]
 */

export class IPLimitMiddlewareNode {    

    applyMiddleware(app) {
        return (req, res, next) => {
            return new Promise((resolve, reject) => {
                if(app.get('allowedIPs').indexOf(req.ip) > -1) {
                    return resolve();
                } else return reject();
            });
        };
    }

}

export class IPLimitMiddleware {

    applyMiddleware(app) {
        return (req, res, next) => {
            if(app.get('allowedIPs').indexOf(req.ip) > -1) {
                next();
            } else res.status(401).json({status: 'Unauthorized'});
        };
    }

}
