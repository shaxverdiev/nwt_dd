const ApiError = require("../exeptions/api-error");
const keyService = require("../service/key-service");
const tokenService = require("../service/token-service");

//этот mw проверяет роль пользователя который хочет получить доступ к определенному роуту
module.exports = function (req, res, next) {
  try {
    // смотрим, есть ли заголовок авторизации в пришедшем запросе
    const authHeader = req.headers.authorization;
    // if (!authorizationHeader) {
    //   return next(ApiError.UnAuthorizedError());
    // }
 
    // //вытаскиваем access токен
    const accessToken = authHeader.split(" ")[1];
    // if (!accessToken) {
    //   return next(ApiError.UnAuthorizedError());
    // }

    // проверяем роль пользоваетеля
    const userData = tokenService.validateAccessToken(accessToken);
  
    
    // активен ли его ключ(проверяем стоит ли его uid напротив key в таблице key)
    const userKey = keyService.validateKeyUser(userData.uid);
    console.log("##################3", userKey);

    // throw console.error("функция заглушка");
    next();
  } catch (e) {
    return next(res.json({ message: "не получилось пройти МИДЛВАРЕ" }));
  }
};
