const db = require("../config/db");

const User = {};

User.create = (nombre, apellido, dni, email, cuit, telefono, direccion, contrasenaHash, esAdmin, callback) => {
  const query = `
    INSERT INTO usuarios (nombre, apellido, dni, email, cuit, telefono, direccion, contrasena, esAdmin) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [nombre, apellido, dni, email, cuit, telefono, direccion, contrasenaHash, esAdmin], callback);
};

User.findByEmail = (email, callback) => {
  const query = "SELECT * FROM usuarios WHERE email = ?";
  db.query(query, [email], callback);
};

module.exports = User;
