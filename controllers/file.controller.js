const { fileModel } = require("../models/models");
const { verifyToken } = require("../service/verifyToken-service");

class FileController {
  createFile(req, res, next) {
    const ver = verifyToken(req);
    const uidFromToken = ver.validToken.uid;
    
    const createDB = fileModel.create({
      name: req.file.filename,
      typefile: req.file.mimetype,
      access_link: null,
      size: req.file.size,
      path: req.file.path,
      user_uid: uidFromToken,
    });
    return res.json()
  }

  async getFile(req, res, next) {
    const ver = verifyToken(req);
    const uidFromToken = ver.validToken.uid;
    const getFileDB = await fileModel.findOne({where: {user_uid: uidFromToken}})
    return res.json(getFileDB)
  }

  //TODO: дописать delete, update
}

module.exports = new FileController();
