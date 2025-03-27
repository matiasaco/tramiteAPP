const express = require("express");
const { crearTramite, obtenerTramites, actualizarEstado } = require("../controllers/tramiteController");
const authMiddleware = require("../middlewares/authMiddleware");
const { subirArchivoFTP } = require("../controllers/ftpController");
const upload = require("../middlewares/uploadMiddleware");
const tramitesController = require("../controllers/tramiteController");



const router = express.Router();

router.post("/crear", authMiddleware, upload.single("archivo"), crearTramite);
router.post("/crear", authMiddleware, crearTramite);
router.get("/", authMiddleware, obtenerTramites);
router.put("/:id", authMiddleware, actualizarEstado);
router.post("/subir", upload.single("archivo"), subirArchivoFTP);
router.delete("/:id", authMiddleware, tramitesController.eliminarTramite);

module.exports = router;
