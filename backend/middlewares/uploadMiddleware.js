const multer = require("multer");
const path = require("path");

// Configurar almacenamiento en local antes de enviarlo al FTP
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
