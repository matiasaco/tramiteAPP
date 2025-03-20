const Tramite = require("../models/Tramite");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Crear un nuevo trámite con los nuevos campos
exports.crearTramite = (req, res) => {
  const { 
    usuario_id, 
    tipo_pago, 
    num_boletas, 
    archivo, 
    nombre, 
    apellido, 
    dni, 
    cuit, 
    localidad 
  } = req.body;

  // Crear un trámite con todos los campos
  Tramite.create(
    usuario_id, 
    tipo_pago, 
    num_boletas, 
    archivo, 
    nombre, 
    apellido, 
    dni, 
    cuit, 
    localidad, 
    "pendiente",  // estado inicial
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error al crear trámite" });
      }
      res.status(201).json({ message: "Trámite creado con éxito" });
    }
  );
};

// Obtener trámites de un usuario
exports.obtenerTramites = (req, res) => {
  const { usuario_id, esAdmin } = req.user;

  if (esAdmin) {
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailUsuario,
      subject: "Actualización de Trámite",
      text: `Su trámite ha sido actualizado a: ${estado}. Comentarios: ${comentario}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) return res.status(500).json({ message: "Error al enviar email" });
      res.json({ message: "Estado actualizado y notificación enviada" });
    });
  });
};
