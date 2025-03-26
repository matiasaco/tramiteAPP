const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Tu correo
    pass: process.env.EMAIL_PASS, // Tu contraseña o App Password de Gmail
  },
});

/**
 * Enviar un email de notificación
 * @param {string} destinatario - Email del usuario
 * @param {string} asunto - Asunto del email
 * @param {string} mensaje - Contenido del email
 */
const enviarEmail = async (destinatario, asunto, mensaje) => {
  try {
    const mailOptions = {
      from: `"Trámites Online" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      text: mensaje,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📩 Email enviado:", info.response);
  } catch (error) {
    console.error("❌ Error al enviar email:", error);
  }
};

module.exports = { enviarEmail };
