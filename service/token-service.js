const jwt = require("jsonwebtoken");
const { tokenModel } = require("../models/user-token-model");

class TokenService {
  //payload получили из userDto
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    console.log('access------------------',accessToken)
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    console.log('refresh-------------------', refreshToken)
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    console.log('FROM SAVE TOKEN ===================',userId, refreshToken)
    // находим в бд uid user'a пришедший из dto// ТУТ НУЖНО НАЙТИ/ПОЛУЧИТЬ ПОЛЕ TOKEN.UID_ID ДЛЯ ТОГО ЧТО БЫ В НЕГО ВСТАВИТЬ UUID ЮЗЕРА b
    const tokenData = await tokenModel.findAll({});
    if (tokenData) {
      //код ниже перезаписывает рефреш токен если таковой имеется
      tokenData.refreshToken = refreshToken;
      // возвращем сохраненный рефреш токен
      return tokenData.save();
    }
  }
}

module.exports = new TokenService();
