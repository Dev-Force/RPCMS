import path from 'path'
let rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

// Use this Object literal to configure the whole project
let config = {
    root: rootPath,
    app: {
      name: 'rpcms'
    },
    port: process.env.PORT || 3000,
    allowedIPs: [
      '83.212.240.66',
      '46.177.45.63',
      '127.0.0.1',
      '0.0.0.0',
      '::1'
    ],
    central_system: {
      methodInvocationURL: 'http://localhost:3000/api/v1/users',
      requestMethod: 'GET'
    },
    secret: 'thisisasupersecret'
};

switch(env) {
  case 'development':
  config.env = 'development';
  break;
  
  case 'test':
  config.env = 'test';
  break;
  
  case 'production':
  config.env = 'production';
  break;
  
  default:
  config.env = 'development';
}

config.db = `mongodb://localhost/rpcms-${config.env}`;

module.exports = config;
