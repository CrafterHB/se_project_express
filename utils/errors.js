const STATUS_BY_NAME = {
  BadRequestError: 400,
  UnauthorizedError: 401,
  ForbiddenError: 403,
  NotFoundError: 404,
  DocumentNotFoundError: 404,
  ValidationError: 400,
  CastError: 400,
  ConflictError: 409,
  InternalServerError: 500,
  AssertionError: 400,
};

function getStatusByName(name) {
  return STATUS_BY_NAME[name] || 500;
}

module.exports = { STATUS_BY_NAME, getStatusByName };
