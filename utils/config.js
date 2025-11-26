const { JWT_SECRET = "super_secret_password" } = process.env;

module.exports = {
  JWT_SECRET,
};
