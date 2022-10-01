const tokenService = require('../service/token-service')

// вытаскивает основные поля из токена (uid, role, key итд) в соответствии с userDto
module.exports.verifyToken = function(req) {
  const token = req.headers.authorization
  const accessToken = token.split(" ")[1];
  const validToken = tokenService.validateAccessToken(accessToken, process.env.JWT_ACCESS_SECRET)
  return {validToken}
}

