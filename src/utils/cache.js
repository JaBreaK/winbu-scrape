const NodeCache = require('node-cache');

// Initialize cache with standard TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

const cacheMiddleware = (duration) => (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log(`⚡ Cache Hit: ${key}`);
        return res.json(cachedResponse);
    }

    console.log(`💨 Cache Miss: ${key}`);

    // Override res.json to store response in cache
    const originalJson = res.json;
    res.json = (body) => {
        cache.set(key, body, duration);
        return originalJson.call(res, body);
    };

    next();
};

module.exports = {
    cache,
    cacheMiddleware
};
