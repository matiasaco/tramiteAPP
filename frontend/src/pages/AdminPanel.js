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
      .get("http://localhost:5000/api/tramites", {
        headers: { Authorization: localStorage.getItem("token") },
      })
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
    } catch (error) {
      console.error("❌ Error al actualizar trámite:", error);
      alert("Error al actualizar trámite.");
    }
  };

  const eliminarTramite = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este trámite?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tramites/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      alert("Trámite eliminado correctamente.");
      setTramites(tramites.filter((tramite) => tramite.id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar trámite:", error);
      alert("Error al eliminar trámite.");
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
            <p><strong>Nombre:</strong> {tramite.nombre} {tramite.apellido}</p>
            <p><strong>Tipo:</strong> {tramite.tipo_pago}</p>
            <p><strong>Estado:</strong> {tramite.estado}</p>
            <p><strong>Comentario:</strong> {tramite.comentario || "Sin comentarios"}</p>
            <a href={`ftp://127.0.0.1/uploads/${tramite.archivo}`} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              Descargar Archivo
            </a>
            <div className="mt-4">
              <select value={estado} onChange={(e) => setEstado(e.target.value)} className="border p-2">
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
              <input
                type="text"
                placeholder="Comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="border p-2 ml-2"
              />
              <button onClick={() => actualizarTramite(tramite.id, tramite.email)} className="bg-green-500 text-white px-4 py-2 rounded ml-2">
                Actualizar
              </button>
              <button onClick={() => eliminarTramite(tramite.id)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
                Eliminar
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay trámites disponibles.</p>
      )}
    </div>
  );
};

export default AdminPanel;
