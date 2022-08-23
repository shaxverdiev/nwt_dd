const bcrypt = require("bcrypt");
const UserDto = require("../dto/user-dto");
const tokenService = require("./token-service");
const { tokenModel, userModel } = require("../models/user-token-model");

class UserService {
  async registration(email, password) {
    // тут получить email
    // const candidate = await userModel
    const hashPassword = await bcrypt.hash(password, 3);

    // создаем пользователя в таблице 'users'
    const user = await userModel.create({ email, password: hashPassword });

    // создаем токен для этого пользователя в таблице 'tokens'
    const userDto = new UserDto(user); // из user извлекаются необходимые поля для создания payload
    const tokens = tokenService.generateTokens({ ...userDto });
    console.log(tokens)
    //сохраняем сгенерированные токен и uid в базу данных
    await tokenService.saveToken(userDto.uid, tokens.refreshToken); // userDto.id - колонка uid_id, token.refreshToken - колонка refreshToken в бд

    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();
