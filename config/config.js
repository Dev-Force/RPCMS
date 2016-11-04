import path from 'path'
let rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

// Use this Object literal to configure the whole project
let config = {
    'root': rootPath,
    'app': {
        'name': 'rpcms'
    },
    'port': process.env.PORT || 3000,
    'allowedIPs': [
        '83.212.242.33', // Temp University IP
        '178.128.201.2', // My IP
        '83.212.240.66', // Tsadimas IP
        '46.177.45.63', // Gkoulis IP
        '127.0.0.1'
    ],
    'central_system': {
        'collectOperations': {
            'URL': 'http://localhost:3000/api/v1/operations',
            'requestMethod': 'GET'
        },
        'methodInvocation': {
            'URL': 'https://jsonplaceholder.typicode.com/posts/1',
            'requestMethod': 'GET',
            'options': {
                // the available options are described here https://github.com/tomas/needle#request-options
            }
        }
    },
    'secret': 'thisisasupersecret'
};

switch (env) {
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

config.db = `mongodb://127.0.0.1/rpcms-${config.env}`;

module.exports = config;
