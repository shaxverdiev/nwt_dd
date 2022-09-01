const Router = require("express").Router;
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const roleMiddleware = require('../middlewares/role-middleware') 
const router = new Router();


router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/users', authMiddleware, userController.getUsers)
router.get('/refresh', userController.refresh)
router.get('/for_admin', roleMiddleware, userController.forAdmin)
router.post('/generate_adminKey',roleMiddleware, userController.generateNewKey)
    

module.exports = router