import express from 'express';
import glob from 'glob';
import path from 'path';
import RateLimit from 'express-rate-limit';

import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import exphbs from 'express-handlebars';

export default function(app, config) {
    let env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    // Deprecated since we use Angular2
    //
    //app.set('views', config.root + '/app/views');
    //app.set('view engine', 'handlebars');
    //app.engine('handlebars', exphbs({
    //    extName: '.hbs',
    //    partialsDir: `${config.root}/app/views/partials`,
    //    layoutsDir: `${config.root}/app/views/layouts`,
    //    defaultLayout: 'main'
    //}));

    app.set('allowedIPs', config.allowedIPs);
    app.set('secret', config.secret);

    // Enable CORS globally
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        if (req.method === 'OPTIONS') {
            res.status(200);
            res.end();
        } else next();
    });

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
    
    // Angular2
    app.use(express.static(config.root + '/public')); // set the static files location /public/img will be /img for users
    
    app.use(methodOverride());
    app.use(methodOverride('_method'));

    app.use(function(req, res, next) {
        console.info('IP Address: ' + req.ip + ' just connected');
        next();
    });

    // Use only API routes.
    let routers = glob.sync(config.root + '/app/routers/api/**/*.js');
    routers.forEach(function (router) {
        require(router).default(app);
    });
    
    // Catch all Route (Angular2)
    app.get('*', function(req, res) {
        res.sendFile(path.join(config.root, '/public/index.html'));
    });

    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            console.log(err.stack);
            res.json({
                message: err.message,
                error: err.stack,
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
