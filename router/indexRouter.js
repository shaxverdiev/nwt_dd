const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const postController = require("../controllers/post-controller");
const fileController = require('../controllers/file.controller.js')
const commentController = require("../controllers/comment-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const roleMiddleware = require("../middlewares/role-middleware");
const uploadMiddleware = require('../middlewares/uploade.middleware')
const { body } = require("express-validator");
const router = new Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 15 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/users", authMiddleware, userController.getUsers);
router.get("/refresh", userController.refresh);
router.get("/for_admin", roleMiddleware, userController.forAdmin);
router.post(
  "/generate_adminKey",
  roleMiddleware,
  userController.generateNewKey
);



router.post("/add_post", authMiddleware, postController.addPost);
router.get("/posts", postController.getPosts);
router.get("/posts/:id", postController.getOnePost);
router.delete("/posts/:id/delete", authMiddleware, postController.deletePost);



router.get("/posts/:id/comment", commentController.getComments);
router.get(
  "/posts/:id/comment/:comment_id",
  authMiddleware,
  commentController.getOneComment
);
router.delete(
  "/posts/:id/comment/:comment_id/delete",
  authMiddleware,
  commentController.deleteComment
);
router.post(
  "/posts/:id/comment/create",
  authMiddleware,
  commentController.createComment
);


router.post("/upload", [ authMiddleware, uploadMiddleware.single('image')], fileController.createFile)
router.get("/get_file", authMiddleware, fileController.getFile)
module.exports = router;
