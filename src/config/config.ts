export const config = () => ({
  port: process.env.PORT || 3000,
  redis_host: process.env.REDIS_HOST || 'localhost',
  redis_port: process.env.REDIS_PORT || 6379,
})