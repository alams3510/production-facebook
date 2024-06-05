const redisClient = require("./redis");

// Middleware to check if the response is cached
const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    const cachedResponse = await redisClient.get(key);
    if (cachedResponse) {
      res.send(JSON.parse(cachedResponse));
    } else {
      // Override res.send to cache the response before sending it to the client
      const originalSend = res.send.bind(res);
      res.send = async (body) => {
        await redisClient.setex(key, 180, JSON.stringify(body)); // Cache for 180 sec
        originalSend(body);
      };
      next();
    }
  } catch (err) {
    console.error("Redis error:", err);
    next(); // Proceed without cache if there's an error
  }
};

module.exports = cacheMiddleware;
