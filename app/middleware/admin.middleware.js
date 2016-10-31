import Promise from 'bluebird';


export class AdminMiddlewareNode {

    applyMiddleware(app) {
        return (req, res, next) => {
            return new Promise((resolve, reject) => {
                if(req.decoded && req.decoded.admin === true){
                    return resolve();
                } else reject();
            });
        };
    }

}

export class AdminMiddleware {

    applyMiddleware(app) {
        return (req, res, next) => {
            if(req.decoded && req.decoded.admin === true) next();
            else res.status(401).json({status: 'Unauthorized'});
        };
    }

}
