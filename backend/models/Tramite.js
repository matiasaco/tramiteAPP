const db = require("../config/db");

const Tramite = {};

Tramite.create = (usuario_id, tipo_pago, num_boletas, archivo, estado, callback) => {
  const query = `
    INSERT INTO tramites (usuario_id, tipo_pago, num_boletas, archivo, estado) 
    VALUES (?, ?, ?, ?, ?)`;
  
  db.query(query, [usuario_id, tipo_pago, num_boletas, archivo, estado], callback);
};

Tramite.findAll = (callback) => {
  const query = "SELECT * FROM tramites";
  db.query(query, callback);
};

Tramite.findByUserId = (usuario_id, callback) => {
  const query = "SELECT * FROM tramites WHERE usuario_id = ?";
  db.query(query, [usuario_id], callback);
};

Tramite.updateEstado = (id, estado, callback) => {
  const query = "UPDATE tramites SET estado = ? WHERE id = ?";
  db.query(query, [estado, id], callback);
};

Tramite.addComentario = (id, comentario, callback) => {
  const query = "UPDATE tramites SET comentario = ? WHERE id = ?";
  db.query(query, [comentario, id], callback);
};

module.exports = Tramite;
