const userService = require("../service/user-service");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      console.log("controller work...");
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
      console.log(
        "ДОШЛО ДО КОНТРОЛЛЕРА.........................................."
      );
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
      console.log('ЭТО РЕФРЕШ ТОКЕН ИЗ КУК КОТОРЫЙ НУЖНО ОБНОВИТЬ', req.cookies.refreshToken)
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
}

module.exports = new UserController();
