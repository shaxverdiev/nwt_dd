
// const fs = require('fs')

// class FileService {

//     // не физический файл в объект модели
//     createDir(file) {
//         const filePath = `{${process.env.FILE_PATH}\\${file.user}\\${file.path}}`
//         return new Promise(((resolve, reject) => {
//             try {
//                 if(!fs.existsSync(file)) {
//                     fs.mkdirSync(filePath)
//                     return resolve({message: 'File was created!'})
//                 } else {
//                     return reject({message: 'File error'})
//                 }
//             } catch (e) {
//                 return reject({message: "file error"})
//             }
//         }))
//     }
// }


// module.exports = new FileService()