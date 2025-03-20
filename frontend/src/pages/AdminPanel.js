import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const [tramites, setTramites] = useState([]);
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [estado, setEstado] = useState("pendiente");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tramites", { headers: { Authorization: localStorage.getItem("token") } })
      .then((res) => setTramites(res.data))
      .catch((err) => console.error(err));
  }, []);

  const actualizarTramite = async (id, emailUsuario) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tramites/${id}`,
        { estado, comentario, emailUsuario },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      alert("Trámite actualizado y notificación enviada.");
      window.location.reload();
    } catch {
      alert("Error al actualizar el trámite.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">Cerrar Sesión</button>

      <h3 className="text-xl font-semibold mb-2">Lista de Trámites</h3>
      {tramites.length > 0 ? (
        tramites.map((tramite) => (
          <div key={tramite.id} className="p-4 mb-4 bg-white shadow rounded">
            <p><strong>Usuario ID:</strong> {tramite.usuario_id}</p>
            <p><strong>Tipo:</strong> {tramite.tipo_pago}</p>
            <p><strong>Estado:</strong> {tramite.estado}</p>
            <p><strong>Comentario:</strong> {tramite.comentario || "Sin comentarios"}</p>
            <a href={`http://tu-servidor-ftp.com/${tramite.archivo}`} className="text-blue-500" target="_blank" rel="noopener noreferrer">
              Descargar Archivo
            </a>
            <button onClick={() => setSelectedTramite(tramite)} className="btn-primary mt-2">Actualizar</button>
          </div>
        ))
      ) : (
        <p>No hay trámites registrados.</p>
      )}

      {selectedTramite && (
        <div className="p-4 mt-4 bg-gray-100 rounded">
          <h3 className="text-xl font-semibold">Actualizar Trámite</h3>
          <label className="block">Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="input">
            <option value="pendiente">Pendiente</option>
            <option value="en revisión">En Revisión</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>

          <label className="block">Comentario:</label>
          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} className="input"></textarea>

          <button className="btn-primary mt-4" onClick={() => actualizarTramite(selectedTramite.id, selectedTramite.email)}>
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
