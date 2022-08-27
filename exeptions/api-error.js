module.exports = class ApiError extends Error {
  constructor(status, message, error = []) {
    super(message);
    this.status = status;
    this.error = error;
  }

  static UnAuthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BadRequest(message, error = []) {
    return new ApiError(400, message, error);
  }
};
