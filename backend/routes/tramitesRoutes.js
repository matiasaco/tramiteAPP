const express = require("express");
const { crearTramite, obtenerTramites, actualizarEstado } = require("../controllers/tramiteController");
const authMiddleware = require("../middleweres/authMiddlewere");
const { subirArchivoFTP } = require("../controllers/ftpController");
const upload = require("../middlewares/uploadMiddleware");


const router = express.Router();

router.post("/crear", authMiddleware, crearTramite);
router.get("/", authMiddleware, obtenerTramites);
router.put("/:id", authMiddleware, actualizarEstado);
router.post("/subir", upload.single("archivo"), subirArchivoFTP);

module.exports = router;
