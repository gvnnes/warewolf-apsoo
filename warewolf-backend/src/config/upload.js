const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
  
    const name = path.basename(file.originalname, ext).replace(/\s/g, '_');
    cb(null, `${Date.now()}-${name}${ext}`);
  }
});

module.exports = multer({ storage });