const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = (req, res) => {
  const { nombre, apellido, dni, email, cuit, telefono, direccion, contrasena, esAdmin, adminPin } = req.body;

  if (esAdmin && adminPin !== "123") {
    return res.status(403).json({ message: "Pin de administrador incorrecto" });
  }

  bcrypt.hash(contrasena, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Error en la encriptación" });

    User.create(nombre, apellido, dni, email, cuit, telefono, direccion, hash, esAdmin, (err, result) => {
      if (err) return res.status(500).json({ message: "Error al registrar usuario" });
      res.status(201).json({ message: "Usuario registrado con éxito" });
    });
  });
};

exports.login = (req, res) => {
  const { email, contrasena } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

    const user = results[0];
    bcrypt.compare(contrasena, user.contrasena, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user.id, esAdmin: user.esAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, esAdmin: user.esAdmin });
    });
  });
};
