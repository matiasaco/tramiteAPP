const db = require("../config/db");

const Tramite = {
  create: (usuario_id, tipo_pago, num_boletas, archivo, nombre, apellido, dni, cuit, localidad, estado, callback) => {
    const query = `
      INSERT INTO tramites (usuario_id, tipo_pago, num_boletas, archivo, nombre, apellido, dni, cuit, localidad, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [usuario_id, tipo_pago, num_boletas, archivo, nombre, apellido, dni, cuit, localidad, estado], callback);
  },

  findByUserId: (usuario_id, callback) => {
    db.query("SELECT * FROM tramites WHERE usuario_id = ?", [usuario_id], callback);
  },

  findAll: (callback) => {
    db.query("SELECT * FROM tramites", callback);
  },

  updateEstado: (id, estado, callback) => {
    db.query("UPDATE tramites SET estado = ? WHERE id = ?", [estado, id], callback);
  },

  addComentario: (id, comentario, callback) => {
    db.query("UPDATE tramites SET comentario = ? WHERE id = ?", [comentario, id], callback);
  },
};

module.exports = Tramite;
