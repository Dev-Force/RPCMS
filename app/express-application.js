import mongoose from 'mongoose';
import express from 'express';

/**
 * The application Itself
 * 
 * @class ExpressApplication
 */
export default class ExpressApplication {

    _app;
    _config;
    _db;
    _server_ip;

    /**
     * Creates an instance of ExpressApplication.
     * 
     * @param {any} config
     * 
     * @memberOf ExpressApplication
     */
    constructor(config) {
        this._config = config;
        this._server_ip = process.env.SERVER_IP || 'localhost'
    }

    /**
     * Sets the Database connection
     * 
     * 
     * @memberOf ExpressApplication
     */
    setupDatabase() {
        mongoose.connect(this._config.db);
        this._db = mongoose.connection;
        this._db.on('error', () => { throw new Error('unable to connect to database at ' + this._config.db) });
    }

    /**
     * Requires All models from the models folder
     * 
     * @param {any} models
     * 
     * @memberOf ExpressApplication
     */
    requireModels(models) {
        models.forEach((model) => require(model));
    }


    /**
     * Used to initiate the application
     * 
     * 
     * @memberOf ExpressApplication
     */
    init() {
        this._app = express();

        require('../config/express').default(this._app, this._config);

        this._app.listen(this._config.port, this._server_ip, () => {
            console.log('Express server listening on port ' + this._config.port);
        });
    }

}
