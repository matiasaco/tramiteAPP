import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [tramites, setTramites] = useState([]);
  const [nuevoTramite, setNuevoTramite] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    cuit: "",
    localidad: "Campos Salles",
    tipo_pago: "duplicado",
    num_boletas: 1,
    archivo: null,
  });

  const [enviado, setEnviado] = useState(false); // Estado para el botón

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
    setEnviado(false); // Asegurar que el botón no esté en estado "enviado"

    const formData = new FormData();
    formData.append("nombre", nuevoTramite.nombre);
    formData.append("apellido", nuevoTramite.apellido);
    formData.append("dni", nuevoTramite.dni);
    formData.append("cuit", nuevoTramite.cuit);
    formData.append("localidad", nuevoTramite.localidad);
    formData.append("tipo_pago", nuevoTramite.tipo_pago);
    formData.append("num_boletas", nuevoTramite.num_boletas);
    formData.append("archivo", nuevoTramite.archivo);

    try {
      await axios.post("http://localhost:5000/api/tramites/crear", formData, {
        headers: { Authorization: localStorage.getItem("token"), "Content-Type": "multipart/form-data" },
      });

      alert("Trámite enviado con éxito");
      setNuevoTramite({
        nombre: "",
        apellido: "",
        dni: "",
        cuit: "",
        localidad: "Campos Salles",
        tipo_pago: "duplicado",
        num_boletas: 1,
        archivo: null,
      });

      setEnviado(true); // Cambiar el estado del botón a "enviado"

      setTimeout(() => setEnviado(false), 3000); // Volver a su estado normal después de 3s
    } catch {
      alert("Error al enviar trámite");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Mis Trámites</h2>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">Cerrar Sesión</button>

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <label className="block">Nombre:</label>
        <input type="text" name="nombre" value={nuevoTramite.nombre} onChange={handleChange} className="input" required />

        <label className="block">Apellido:</label>
        <input type="text" name="apellido" value={nuevoTramite.apellido} onChange={handleChange} className="input" required />

        <label className="block">DNI:</label>
        <input type="text" name="dni" value={nuevoTramite.dni} onChange={handleChange} className="input" required />

        <label className="block">CUIT:</label>
        <input type="text" name="cuit" value={nuevoTramite.cuit} onChange={handleChange} className="input" required />

        <label className="block">Localidad:</label>
        <select name="localidad" value={nuevoTramite.localidad} onChange={handleChange} className="input" required>
          <option value="Campos Salles">Campos Salles</option>
          <option value="Conesa">Conesa</option>
          <option value="Erézcano">Erézcano</option>
          <option value="General Rojo">General Rojo</option>
          <option value="La Emilia">La Emilia</option>
          <option value="San Nicolás de los Arroyos">San Nicolás de los Arroyos</option>
          <option value="Villa Campi">Villa Campi</option>
          <option value="Villa Canto">Villa Canto</option>
          <option value="Villa Esperanza">Villa Esperanza</option>
          <option value="Villa Hermosa">Villa Hermosa</option>
          <option value="Villa Riccio">Villa Riccio</option>
        </select>

        <label className="block">Tipo de Pago:</label>
        <select name="tipo_pago" value={nuevoTramite.tipo_pago} onChange={handleChange} className="input">
          <option value="duplicado">Pago Duplicado</option>
          <option value="no acreditado">No Acreditado</option>
        </select>

        <label className="block">Cantidad de Boletas:</label>
        <input type="number" name="num_boletas" value={nuevoTramite.num_boletas} onChange={handleChange} className="input" required />

        <label className="block">Adjuntar Boletas (PDF):</label>
        <input type="file" onChange={handleFileChange} className="input" required />

        <button type="submit" className={`w-full p-2 mt-4 rounded ${enviado ? "bg-green-500" : "bg-blue-500"} text-white`}>
          {enviado ? "✓" : "Enviar Trámite"}
        </button>
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
