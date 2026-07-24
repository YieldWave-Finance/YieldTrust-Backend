const store = new Map();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000;
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX, 10) || 100;

function rateLimit(options = {}) {
  const windowMs = options.windowMs || WINDOW_MS;
  const max = options.max || MAX_REQUESTS;
  const message = options.message || 'Too many requests, please try again later';

  return function rateLimitMiddleware(req, res, next) {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!store.has(key)) {
      store.set(key, []);
    }

    const timestamps = store.get(key).filter((ts) => now - ts < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({ error: message });
    }

    timestamps.push(now);
    store.set(key, timestamps);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - timestamps.length));
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    next();
  };
}

function resetStore() {
  store.clear();
}

module.exports = { rateLimit, resetStore };
