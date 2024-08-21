const multer = require('multer');
const path = require('path');

// Define storage for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext); // Unique filename
  }
});

// Create the multer instance with the storage configuration
const upload = multer({ storage });

module.exports = upload;
