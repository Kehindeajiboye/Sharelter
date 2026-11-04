const multer = require('multer');

// 1. Where to store: RAM, as a Buffer
const storage = multer.memoryStorage();

// 2. Which files to accept
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true); // accept
    } else {
        const error = new Error('Only JPEG, PNG and WEBP images are allowed');
        error.status = 400;
        cb(error); // reject, passing the error on
    }
};

// 3. Combine everything
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB in bytes
        files: 1,                  // only one file per request
    },
});

module.exports = upload;