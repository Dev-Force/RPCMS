module.exports = function(app, router) {
    
    if(router === undefined) router = app;

    router.use(function(req, res, next) {
        if(app.get('allowedIPs').indexOf(req.ip) > -1) next();
        else res.status(403).json({status: 'Forbidden'});
    });
    
};