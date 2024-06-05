const { createClient } = require("ioredis");

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connectTimeout: 10000,
  },
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (error) => {
  console.log("Error in Redis server", error);
});
client.on("ready", () => {
  console.log("Redis client ready");
});

client.on("reconnecting", (delay, attempt) => {
  console.log(
    `Reconnecting to Redis Cloud: attempt ${attempt}, delay ${delay}ms`
  );
});

client.on("end", () => {
  console.log("Disconnected from Redis Cloud");
});

client.on("warning", (warning) => {
  console.warn("Redis warning: ", warning);
});

process.on("SIGINT", () => {
  redis.quit(() => {
    console.log("Redis connection closed");
    process.exit();
  });
});

process.on("SIGTERM", () => {
  redis.quit(() => {
    console.log("Redis connection closed");
    process.exit();
  });
});

module.exports = client;
