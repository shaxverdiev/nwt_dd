const ApiError = require("../exeptions/api-error");
const tokenService = require("../service/token-service");

// этот миддларе проверяет авторизирован ли пользователь и можно ли ему получать данные
module.exports = function (req, res, next) {
  try {
    // вытаскиваем из хэдера авторизации ACCESS токен
    const authorizationHeader = req.headers.authorization
    //поверка есть ли существует ли вообще такой header
    if (!authorizationHeader) {
      return next(ApiError.UnAuthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnAuthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnAuthorizedError());
    }

    // если все успешно в поле user у request'a помещаем данные пользователя
    req.user = userData;
    next();
  } catch (e) {
    // в случае ошибки вылетает ошибка авторизации
    return next(ApiError.UnAuthorizedError());
  }
};
