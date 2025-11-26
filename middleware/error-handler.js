const express = require("express");
const app = express();

const NotFoundError = require("../errors/not-found-err.js");
const BadRequestError = require("../errors/bad-request-err.js");
const ForbiddenError = require("../errors/forbidden-err.js");
const UnauthorizedError = require("../errors/unauthorized-err.js");
const ConflictError = require("../errors/conflict-error.js");

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });

  next(err);
});

module.exports = {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError,
};
