const Router = require("express").Router;
const userController = require('../controllers/user-controller')
const router = new Router();


router.post('/registration', userController.registration)
module.exports = router