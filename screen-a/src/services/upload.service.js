const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>{
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName)
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
}).single('file');

module.exports = {
  upload,
};
