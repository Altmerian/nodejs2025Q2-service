export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  cryptSalt: parseInt(process.env.CRYPT_SALT, 10) || 10,
});
