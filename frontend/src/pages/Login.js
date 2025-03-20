import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", email: "", cuit: "", telefono: "", direccion: "", contrasena: "", esAdmin: false, adminPin: "" });
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      login(form.email, form.contrasena);
    } else {
      try {
        await axios.post("http://localhost:5000/api/auth/register", form);
        alert("Usuario registrado, ahora inicie sesión");
        setIsLogin(true);
      } catch (error) {
        alert("Error al registrar usuario");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold text-center">{isLogin ? "Iniciar Sesión" : "Registro"}</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          {!isLogin && (
            <>
              <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} className="w-full p-2 mb-2 border" required />
              <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} className="w-full p-2 mb-2 border" required />
              <input type="text" name="dni" placeholder="DNI" onChange={handleChange} className="w-full p-2 mb-2 border" required />
              <input type="text" name="cuit" placeholder="CUIT" onChange={handleChange} className="w-full p-2 mb-2 border" required />
              <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} className="w-full p-2 mb-2 border" required />
              <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} className="w-full p-2 mb-2 border" required />
            </>
          )}
          <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} className="w-full p-2 mb-2 border" required />
          <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} className="w-full p-2 mb-2 border" required />
          {!isLogin && (
            <div className="flex items-center mt-2">
              <label className="mr-2">¿Eres Administrador?</label>
              <input type="checkbox" name="esAdmin" onChange={(e) => setForm({ ...form, esAdmin: e.target.checked })} />
            </div>
          )}
          {form.esAdmin && !isLogin && <input type="text" name="adminPin" placeholder="Pin de Administrador" onChange={handleChange} className="w-full p-2 mb-2 border" />}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 mt-2">{isLogin ? "Ingresar" : "Registrarse"}</button>
        </form>
        <button className="text-blue-500 mt-4" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
};

export default Login;
