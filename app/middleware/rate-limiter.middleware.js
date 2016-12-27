import Promise from 'bluebird';
import RateLimit from 'express-rate-limit';

export class RateLimiterMiddleware {

    applyMiddleware() {
        return new RateLimit({
            windowMs: 24 * 60 * 60 * 1000, // 24 hours
            max: 100, // limit each IP to 100 requests per windowMs
            delayMs: 0 // disable delaying - full speed until the max limit is reached
        });
    }

}