export default () => ({
  port: (() => {
    const port = parseInt(process.env.PORT, 10);
    if (isNaN(port) || port <= 0 || port > 65535) return 4000;
    return port;
  })(),
  cryptSalt: (() => {
    const salt = parseInt(process.env.CRYPT_SALT, 10);
    if (isNaN(salt) || salt < 1) return 10;
    return salt;
  })(),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/database_name',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: (() => {
      const port = parseInt(process.env.POSTGRES_PORT, 10);
      if (isNaN(port) || port <= 0 || port > 65535) return 5432;
      return port;
    })(),
    username: process.env.POSTGRES_USER || 'username',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'database_name',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  logging: {
    level: process.env.LOG_LEVEL || 'log',
    dir: process.env.LOG_DIR || 'logs',
    maxSizeKb: (() => {
      const size = parseInt(process.env.LOG_MAX_SIZE_KB, 10);
      if (isNaN(size) || size <= 0) return 100;
      return size;
    })(),
  },
});
