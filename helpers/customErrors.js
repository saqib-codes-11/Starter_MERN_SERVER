const customError = (status, code, message) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
};

exports.customError = customError;
exports.inputErr = customError(
  422,
  "ERR_ASSERTION",
  "firstName, lastName, date_of_birth must exist. password must include lower, upper, numbers, and special characters, and at least with length 8. gender must be male or female"
);
exports.authError = customError(
  401,
  "AUTH_ERROR",
  "invalid username or password"
);
exports.authorizationError = customError(403, 'AUTHORIZATION_ERROR', 'you are not authorized on this action');
