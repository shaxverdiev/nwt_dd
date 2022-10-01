const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  //место назначения
  destination(req, file, cb) {
    cb(null, "storage/");
  },
  filename(req, file, cb) {
    // date - дата загрузки и формирования файла
    const date = moment().format("DDMMYYYY-HHmmss_SSS");
    cb(null, `${date}--${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const  limits = { 
    fileSize: 1024 * 1024 * 5
}

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});
