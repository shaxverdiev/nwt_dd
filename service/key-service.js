const roleModel = require("../models/models");

// по идее ключи для админов уже создал супер пользователь и они уже есть в базе данных
// остается только подставить определенный uid к определенному key в таблице keys

//код ниже можно завернуть в транзакцию
// если хоть одно условие в if не будет валидным - откатить изменения полностью и вернуть юзеру ответ с ошибкой валидации его как юзера
class KeyService {
  //эта функция сохраняет uid в таблицу keys для доступа ADMIN к скрытым роутам
  async saveKeys(uid, role, key) {
    const { keysModel } = roleModel;

    if (role !== "ADMIN") {
      return null;
    }

    const findKeyDB = await keysModel.findOne({ where: { access_key: key } });
    if (findKeyDB && role == "ADMIN") {
      return await keysModel.update(
        {
          user_uid: uid,
        },
        {
          where: {
            access_key: key,
          },
        }
      );
    } else {
      return null;
    }
  }

  //   а эта функция валидирует uid пользователя который хочет попасть на определенный роут
  //  соответствует ли uid к ключу
  async validateKeyUser(uid) {
    //если uid стоит напротив key в таблице key, значит что у этого пользователя есть права администратора
    const { keysModel } = roleModel;
    const findUIDinDB = await keysModel.findOne({ where: { user_uid: uid } });
    console.log("++++++++++++++++++++++++++++", findUIDinDB);

    return findUIDinDB;
  }
}

module.exports = new KeyService();
