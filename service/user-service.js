const bcrypt = require("bcrypt");
const UserDto = require("../dto/user-dto");
const tokenService = require("./token-service");
const keysService = require("../service/key-service");
const { keyValidate, addUIDinTableKeys } = require("../service/key-service");
const ApiError = require("../exeptions/api-error");
const { tokenModel, userModel } = require("../models/models");
const RegUserDB = require("../service/reg-service");
const { sequelize, transaction } = require("../db/db");

class UserService {
  async registration(email, password, role, key) {
    // console.log(email, password, role, key);

    if (role == "ADMIN") {
      const tr = await sequelize.transaction(async () => {
        const one = await keyValidate(key);
        console.log(1);

        const two = await RegUserDB.createINDB(email, password, role, key);
        const {user: userDto, ...tokens} = two
        console.log(2, two.user.uid);
        console.log(two)
        
        //тут нужен uid созданный в RegUserDB.createINDB
        const three = await addUIDinTableKeys(two.user.uid, key);
        console.log(3);
        return { ...tokens, user: userDto, key };
      });
      return tr
    } else {
      console.log("просто юзер .........");
      return await RegUserDB.createINDB(email, password, role, key);
    }
  }

  async login(email, password) {
    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }
    // проверка на совпадение пришедшего пароля
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Не верный пароль");
    }
    // когда пройдены все проверки, генерируются токены и передаются в куки с ответом
    const userDto = new UserDto(user); // из user извлекаются необходимые поля для создания payload
    const tokens = tokenService.generateTokens({ ...userDto });
    console.log(tokens);

    await tokenService.saveToken(userDto.uid, tokens.refreshToken); // userDto.id - колонка uid_id, token.refreshToken - колонка refreshToken в бд
    // возвращаем сгенерированные токены и информацию о пользователе
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    // токен удаляется а пользователь остается в таблице
    const token = await tokenService.removeToken(refreshToken);
    // возвращаем удаленный токен
    return token;
  }

  async getAllUsers() {
    const users = await userModel.findAll();
    return users;
  }

  //функция обновления рефреш токена
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnAuthorizedError();
    }
    // валидируем пришедший из кук токен
    const userData = tokenService.validateRefreshToken(refreshToken);
    console.log(
      "токен провалидирован=======================================================================",
      userData
    );
    // находим этот токен в базе данных

    const tokenFromDB = await tokenService.findToken(refreshToken);
    console.log("токен есть в бд", tokenFromDB); //////////////////////////////////

    if (!userData || !tokenFromDB) {
      throw ApiError.UnAuthorizedError();
    }
    console.log("проверка выше тоже пройдена...................."); /////////////////////////////////////
    // затем находим uid юзера чьим токеном является пришедший из кук
    const user = await userModel.findOne({ where: { uid: userData.uid } });
    console.log("uid юзера чей токен =======================", user); ///////////////////////////////////////////////////////////

    //создаем новый инстанс dto для того что бы подставить туда
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    console.log("НОВЫЕ ТОКЕНЫ СГЕНЕРИРОВАННЫ", tokens); /////////////////////////////////////////////////////
    await tokenService.saveToken(userDto.uid, tokens.refreshToken);

    // возвращеем обновленне токены
    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();
