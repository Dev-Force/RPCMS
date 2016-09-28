import mongoose from 'mongoose';
import express from 'express';

class ExpressApplication {

    _app;
    _config;
    _db;
    _server_ip;

    constructor(config) {
        this._config = config;
        this._server_ip = process.env.SERVER_IP || 'localhost'
    }

    setupDatabase() {
        mongoose.connect(this._config.db);
        this._db = mongoose.connection;
        this._db.on('error', () => { throw new Error('unable to connect to database at ' + this._config.db) });
    }

    requireModels(models) {
        models.forEach((model) => require(model));
    }

    init() {
        this._app = express();

        require('../config/express')(this._app, this._config);

        this._app.listen(this._config.port, this._server_ip, () => {
            console.log('Express server listening on port ' + this._config.port);
        });
    }

};

module.exports = ExpressApplication;