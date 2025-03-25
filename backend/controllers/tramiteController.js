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
  console.log("BODY:", req.body);
  console.log("FILE:", req.file); // Verifica si llega el archivo

  const { 
    usuario_id, 
    tipo_pago, 
    num_boletas, 
    nombre, 
    apellido, 
    dni, 
    cuit, 
    localidad 
  } = req.body;

  // Verificar si se subió un archivo
  const archivo = req.file ? req.file.filename : null;

  // Validar que los campos obligatorios no estén vacíos
  if (!usuario_id || !tipo_pago || !num_boletas || !nombre || !apellido || !dni || !cuit || !localidad) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  // Crear el trámite en la base de datos
  Tramite.create(
    usuario_id, 
    tipo_pago, 
    num_boletas, 
    archivo, // Ahora guarda el archivo correctamente
    nombre, 
    apellido, 
    dni, 
    cuit, 
    localidad, 
    "pendiente",  // Estado inicial
    (err, result) => {
      if (err) {
        console.error("Error al crear trámite:", err);
        return res.status(500).json({ message: "Error al crear trámite" });
      }
      res.status(201).json({ message: "Trámite creado con éxito" });
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
