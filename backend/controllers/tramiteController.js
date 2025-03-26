const Tramite = require("../models/Tramite");
const db =require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Crear un nuevo trámite 
exports.crearTramite = (req, res) => {
  console.log("🔹 BODY:", req.body);
  console.log("🔹 FILE:", req.file);

  const { nombre, apellido, dni, cuit, localidad, tipo_pago, num_boletas } = req.body;
  const archivo = req.file ? req.file.filename : null;
  const usuario_id = req.user ? req.user.id : null; // Obtener el usuario autenticado

  const numBoletas = parseInt(num_boletas, 10);

  if (!nombre || !apellido || !dni || !cuit || !localidad || !tipo_pago || isNaN(numBoletas) || !archivo) {
    console.error("❌ Error: Faltan datos obligatorios o formato incorrecto.");
    return res.status(400).json({ message: "Todos los campos son obligatorios y deben tener el formato correcto." });
  }

  // ✅ Insertar en la base de datos
  Tramite.create(
    usuario_id,  // se envía el usuario_id (o NULL si no hay usuario autenticado)
    tipo_pago,
    numBoletas,
    archivo,
    nombre,
    apellido,
    dni,
    cuit,
    localidad,
    "pendiente",
    (err, result) => {
      if (err) {
        console.error("❌ Error al crear trámite en la base de datos:", err);
        return res.status(500).json({ message: "Error al crear trámite", error: err });
      }
      res.status(201).json({ message: "Trámite creado con éxito." });
    }
  );
};



// Obtener trámites de un usuario
exports.obtenerTramites = (req, res) => {
  const { usuario_id, es_admin } = req.user;

  if (es_admin) {
    Tramite.findAll((err, results) => {
      if (err) return res.status(500).json({ message: "Error al obtener trámites" });
      res.json(results);
    });
  } else {
    Tramite.findByUserId(usuario_id, (err, results) => {
      if (err) return res.status(500).json({ message: "Error al obtener trámites" });
      res.json(results);
    });
  }
};

// Actualizar el estado de un trámite
const { enviarEmail } = require("../services/emailServices");

exports.actualizarEstado = (req, res) => {
  const { id } = req.params;
  const { estado, comentario, emailUsuario } = req.body;

  Tramite.updateEstado(id, estado, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al actualizar trámite" });

    if (comentario) {
      Tramite.addComentario(id, comentario, (err) => {
        if (err) return res.status(500).json({ message: "Error al agregar comentario" });
      });
    }

    // 📩 Enviar email al usuario notificando el cambio de estado
    const asunto = "Actualización de su trámite";
    const mensaje = `Su trámite ha sido actualizado a: ${estado}.\nComentarios: ${comentario || "Sin comentarios"}`;

    enviarEmail(emailUsuario, asunto, mensaje);

    res.json({ message: "Estado actualizado y notificación enviada" });
  });
};

