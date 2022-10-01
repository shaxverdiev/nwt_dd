const { commentModel } = require("../models/models");
const { verifyToken } = require("../service/verifyToken-service");
const { deletePost } = require("./post-controller");

class CommentController {
  async getComments(req, res, next) {
    const postId = req.params.id;
    const getPostWithComments = await commentModel.findAll({
      where: { post_id: postId },
    });
    return res.json(getPostWithComments);
  }

  async getOneComment(req, res, next) {
    const ver = verifyToken(req);
    const uidFromToken = ver.validToken.uid;
    const getOneCom = await commentModel.findOne({
      where: { id: req.params.comment_id },
    });
    return res.json(getOneCom);
  }

  async createComment(req, res, next) {
    const ver = verifyToken(req);
    const uidFromToken = ver.validToken.uid;
    const createCommentDB = commentModel.create({
      contentComment: req.body.content,
      user_id: uidFromToken,
      post_id: req.params.id,
    });
    return res.send("comment added");
  }

  async deleteComment(req, res, next) {
    const ver = verifyToken(req);
    const uidFromToken = ver.validToken.uid;
    console.log(req.params.comment_id);
    const deleteCommentDB = commentModel.destroy({
      where: {
        id: req.params.comment_id,
        user_id: uidFromToken,
        post_id: req.params.id,
      },
    });
    return res.send("comment is delete");
  }
}

module.exports = new CommentController();
