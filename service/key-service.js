const { keyModel } = require("../models/models");

class KeyService {
  async keyValidate(key) {
    const findKeyDB = await keyModel.findOne({
      where: { access_key: key },
    });

    if (findKeyDB != null) {
      return findKeyDB;
    } else {
      throw new Error("нет такого ключа");
    }
  }

  async addUIDinTableKeys(uid, key) {
    await keyModel.update(
      {
        user_uid: uid,
      },
      {
        where: {
          access_key: key,
        },
      }
    );
  }

  async keyGen(secretWord) {
    const secretNum = String(secretWord).length * 34;
    const key = String(secretWord) + secretNum;
    const getKey = await keyModel.create({
      access_key: key,
    });
    console.log(getKey);
  }

  //    ЭТО ДЛЯ MIDDLEWARE
  async validateKeyUser(uid) {
    //если uid стоит напротив key в таблице key, значит что у этого пользователя есть права администратора
    const findUIDinDB = await keyModel.findOne({ where: { user_uid: uid } });

    return findUIDinDB;
  }
}

module.exports = new KeyService();
