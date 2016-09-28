
import express from 'express';
import config from './config/config';
import * as glob from 'glob';
import ExpressApplication from './app/express-application';

let expressApp = new ExpressApplication(config);
expressApp.setupDatabase(config.db);

expressApp.requireModels(glob.sync(
  config.root + '/app/models/*.js'
));

expressApp.init();

