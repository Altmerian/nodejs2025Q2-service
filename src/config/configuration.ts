export default () => ({
  port: (() => {
    const port = parseInt(process.env.PORT, 10);
    if (isNaN(port) || port <= 0 || port > 65535) return 4000;
    return port;
  })(),
  cryptSalt: (() => {
    const salt = parseInt(process.env.CRYPT_SALT, 10);
    if (isNaN(salt) || salt < 1) return 12;
    return salt;
  })(),
});
