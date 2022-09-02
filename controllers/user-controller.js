const userService = require("../service/user-service");
const keyService = require("../service/key-service");
const regService = require("../service/reg-service");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role, key } = req.body;
      const userData = await userService.registration(
        email,
        password,
        role,
        key
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      //достаем рефреш токен из куки
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      //после этого очищаем куки от "refreshTokena"
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      // достаем рефреш токен из куков request'a
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async uploadFile(req, res, next) {
    try {
      const file = req.files.file;
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Upload errorrrr!" });
    }
  }

  async forAdmin(req, res, next) {
    try {
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "you is not admin" });
    }
  }

  async generateNewKey(req, res, next) {
    try {
      const { secretWord } = req.body;
      const keyGen = keyService.keyGen(secretWord);
      return res.json({ message: "ключ сгенерирован" });
    } catch (e) {
      console.log(
        e,
        "generate new key error...............>>>>>>>>>>>>>>>>>>>"
      );
    }
  }
}

module.exports = new UserController();
