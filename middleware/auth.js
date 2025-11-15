const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res) => {
  res.status(401).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => {
  const token = header.replace("Bearer ", "");
  return token;
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
