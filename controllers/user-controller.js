const userService = require('../service/user-service')

class UserController{
    async registration(req, res, next) {
        try{
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            console.log('controller work...')
            return res.json(userData)
        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = new UserController()