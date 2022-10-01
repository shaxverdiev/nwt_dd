const jwt = require("jsonwebtoken");
const {tokenModel} = require("../models/models");


class TokenService {
  //payload получили из userDto
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  // проверяет валидность access токена
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  // валидность рефреш
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    //код ниже перезаписывает рефреш токен, если пришел запрос на обновление токена
    const tokenData = await tokenModel.findOne({ where: { user_uid: userId } });
    if (tokenData) {
      //код ниже перезаписывает рефреш токен если таковой имеется
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    //создаем поля в таблице tokens
    const token = await tokenModel.create({ user_uid: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.destroy({
      where: { refreshToken: refreshToken },
    });
    return tokenData;
  }

  async findToken(refreshTok) {
    const tokenData = await tokenModel.findOne({
      where: { refreshToken: refreshTok },
    });
    return tokenData;
  }
}

module.exports = new TokenService();
