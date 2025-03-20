import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [tramites, setTramites] = useState([]);
  const [nuevoTramite, setNuevoTramite] = useState({ tipo_pago: "duplicado", num_boletas: 1, archivo: null });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tramites", { headers: { Authorization: localStorage.getItem("token") } })
      .then((res) => setTramites(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setNuevoTramite({ ...nuevoTramite, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNuevoTramite({ ...nuevoTramite, archivo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("tipo_pago", nuevoTramite.tipo_pago);
    formData.append("num_boletas", nuevoTramite.num_boletas);
    formData.append("archivo", nuevoTramite.archivo);

    try {
      await axios.post("http://localhost:5000/api/tramites/crear", formData, {
        headers: { Authorization: localStorage.getItem("token"), "Content-Type": "multipart/form-data" },
      });
      alert("Trámite enviado con éxito");
    } catch {
      alert("Error al enviar trámite");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Mis Trámites</h2>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">Cerrar Sesión</button>

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <label className="block">Tipo de Pago:</label>
        <select name="tipo_pago" value={nuevoTramite.tipo_pago} onChange={handleChange} className="input">
          <option value="duplicado">Pago Duplicado</option>
          <option value="no acreditado">No Acreditado</option>
        </select>

        <label className="block">Cantidad de Boletas:</label>
        <input type="number" name="num_boletas" value={nuevoTramite.num_boletas} onChange={handleChange} className="input" required />

        <label className="block">Adjuntar Boletas (PDF):</label>
        <input type="file" onChange={handleFileChange} className="input" required />

        <button type="submit" className="btn-primary mt-4">Enviar Trámite</button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Historial de Trámites</h3>
      {tramites.length > 0 ? (
        tramites.map((tramite) => (
          <div key={tramite.id} className="p-4 mb-4 bg-white shadow rounded">
            <p><strong>Tipo:</strong> {tramite.tipo_pago}</p>
            <p><strong>Estado:</strong> {tramite.estado}</p>
            <p><strong>Comentario:</strong> {tramite.comentario || "Sin comentarios"}</p>
          </div>
        ))
      ) : (
        <p>No tienes trámites registrados.</p>
      )}
    </div>
  );
};

export default Dashboard;
