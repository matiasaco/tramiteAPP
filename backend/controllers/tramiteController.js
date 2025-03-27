const Tramite = require("../models/Tramite");
const db =require("../config/db");
const nodemailer = require("nodemailer");
const { enviarEmail } = require("../services/emailServices");

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


exports.actualizarEstado = (req, res) => {
  const { id } = req.params;
  const { estado, comentario } = req.body;

  // Actualizar estado y comentario
  Tramite.updateEstado(id, estado, (err) => {
    if (err) return res.status(500).json({ message: "Error al actualizar estado" });

    Tramite.addComentario(id, comentario, (err) => {
      if (err) return res.status(500).json({ message: "Error al agregar comentario" });

      // Buscar trámite con el email del usuario y el comentario
      Tramite.TramitefindById(id, (err, tramite) => {
        if (err || !tramite) return res.status(500).json({ message: "Error al obtener trámite" });

        const emailOptions = {
          from: process.env.EMAIL_USER,
          to: tramite.emailUsuario,
          subject: `Actualización de su Trámite #${id}`,
          text: `Su trámite ha cambiado de estado a: ${estado}.\n\nComentario del Administrador: ${tramite.comentario || "Sin comentarios"}`
        };

        transporter.sendMail(emailOptions, (error, info) => {
          if (error) {
            console.error("❌ Error enviando correo:", error);
            return res.status(500).json({ message: "No se pudo enviar el email" });
          }
          res.json({ message: "Estado y comentario actualizados, email enviado" });
        });
      });
    });
  });
};



// Eliminar un tramite 

exports.eliminarTramite = (req, res) => {
  const { id } = req.params;

  // Verificar si el usuario es administrador
  if (!req.user || !req.user.es_admin) {
    return res.status(403).json({ message: "No tienes permisos para eliminar trámites" });
  }

  // Consulta SQL para eliminar el trámite
  const sql = "DELETE FROM tramites WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar trámite", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trámite no encontrado" });
    }

    res.status(200).json({ message: "Trámite eliminado correctamente" });
  });
};
