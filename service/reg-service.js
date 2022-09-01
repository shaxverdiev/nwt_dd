const bcrypt = require("bcrypt");
const UserDto = require("../dto/user-dto");
const tokenService = require("./token-service");
const keysService = require("../service/key-service");
const { keyValidate } = require("../service/key-service");
const ApiError = require("../exeptions/api-error");
const { tokenModel, userModel } = require("../models/models");

class RegUserDB {
  async createINDB(email, password, role, key) {
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await userModel.create({
      email,
      password: hashPassword,
      role,
    });

    // создаем токен для этого пользователя в таблице 'tokens'
    const userDto = new UserDto(user); // из user извлекаются необходимые поля для создания payload

    const tokens = tokenService.generateTokens({ ...userDto });
    //сохраняем сгенерированные токен и uid в базу данных
    await tokenService.saveToken(userDto.uid, tokens.refreshToken); // userDto.id - колонка uid_id, token.refreshToken - колонка refreshToken в бд



    return { ...tokens, user: userDto, key };
  }
}

module.exports = new RegUserDB();
