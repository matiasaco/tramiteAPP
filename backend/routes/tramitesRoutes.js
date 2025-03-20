const express = require("express");
const { crearTramite, obtenerTramites, actualizarEstado } = require("../controllers/tramiteController");
const authMiddleware = require("../middleweres/authMiddlewere");

const router = express.Router();

router.post("/crear", authMiddleware, crearTramite);
router.get("/", authMiddleware, obtenerTramites);
router.put("/:id", authMiddleware, actualizarEstado);

module.exports = router;
