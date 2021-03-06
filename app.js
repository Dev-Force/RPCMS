// Only For Developing !! Delete The Following Line For Production
import 'source-map-support/register';

import express from 'express';
import config from './config/config';
import * as glob from 'glob';
import ExpressApplication from './app/express-application';

let expressApp = new ExpressApplication(config);
expressApp.setupDatabase();

expressApp.requireModels(glob.sync(
  config.root + '/app/models/*.js'
));

expressApp.init();
