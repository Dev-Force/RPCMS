/**
 * Restricts Access to the specified router or application if no
 * router is specified, to the IPs that are only allowed from config
 * 
 * @param {any} app
 * @param {any} [router]
 */
module.exports = function(app, router) {
    
    if(router === undefined) router = app;

    router.use(function(req, res, next) {
        if(app.get('allowedIPs').indexOf(req.ip) > -1) next();
        else res.status(401).json({status: 'Unauthorized'});
    });
    
};