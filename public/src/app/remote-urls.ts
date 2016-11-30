import { isDevMode } from '@angular/core';

// const prefixDev = 'http://83.212.122.31:3000';
const prefixDev = 'http://localhost:3000';
let Urls = {
    users: '/api/v1/users',
    operations: '/api/v1/operations',
    ipAuth: '/api/v1/auth/ip',
    tokenAuth: '/api/v1/auth/token'
};

if(isDevMode()) {
    for(let key in Urls) {
        Urls[key] = prefixDev + Urls[key];
    }
}

export { Urls };