const { pagintaion } = require("../helpers/pagination.helper");
const { postModel, commentModel } = require("../models/models");
const { verifyToken } = require("../service/verifyToken-service");

class PostController {
  addPost(req, res, next) {
    const ver = verifyToken(req);
    const uidFromToken = ver.validToken.uid;

    const createPostDB = postModel.create({
      title: req.body.title,
      contentPost: req.body.content,
      user_id: uidFromToken,
    });
    return res.send("post created");
  }

  async getPosts(req, res, next) {
    try {
      // если есть параметры url тогда срабатывает пагинация
      const pag = await pagintaion(req, postModel);
      if (req.query.page && req.query.limit !== null) {
        return res.json(pag);
      }
      // если нет, тогда просто возвращаются все посты
      const getAll = await postModel.findAll({});
      return res.json(getAll);

    } catch (e) {
      console.log(e);
    }
  }

  async getOnePost(req, res, next) {
    try {
      const queryid = req.params.id;
      const getOne = await postModel.findByPk(queryid);
      res.json({ getOne });
    } catch (e) {
      console.log(e);
    }
  }

  async deletePost(req, res, next) {
    try {
      const ver = verifyToken(req);
      const uidFromToken = ver.validToken.uid;
      const deletePostDB = await postModel.destroy({
        where: { id: req.params.id, user_id: uidFromToken },
      });
      return res.send("post deleted");
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new PostController();
