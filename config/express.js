import express from 'express';
import glob from 'glob';

import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import exphbs from 'express-handlebars';

module.exports = function (app, config) {
    let env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'handlebars');
    app.engine('handlebars', exphbs({
        extName: '.hbs',
        partialsDir: `${config.root}/app/views/partials`,
        layoutsDir: `${config.root}/app/views/layouts`,
        defaultLayout: 'main'
    }));

    app.set('allowedIPs', config.allowedIPs);
    app.set('secret', config.secret);

    // app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(compress());
    app.use(express.static(config.root + '/assets'));
    app.use(express.static(config.root + '/assets/components/bootstrap-sass/assets'));
    
    
    app.use(methodOverride());
    app.use(methodOverride('_method'));

    // Enable CORS globally (Not needed since we use JWT)
    // app.use(function(req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //   next();
    // });

    let routers = glob.sync(config.root + '/app/routers/**/*.js');
    routers.forEach(function (router) {
        require(router)(app);
    });

    // var controllers = glob.sync(config.root + '/app/controllers/*.js');
    // controllers.forEach(function (controller) {
    //   require(controller)(app);
    // });

    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    // app.use(function (err, req, res, next) {
    //   res.status(err.status || 500);
    //   res.render('error', {
    //     message: err.message,
    //     error: {},
    //     title: 'error'
    //   });
    // });

    if (app.get('env') === 'production')
        app.use(function (err, req, res, next) {
            res.redirect('/');
        });

};
