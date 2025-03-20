import axios from 'axios';

// Crea una instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Cambia esto si tu API está en otro lugar
});

// Función para obtener datos desde la API
export const getTramites = async () => {
  try {
    const response = await api.get('/tramites');
    return response.data;  // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener los trámites:', error);
    throw error;  // Propaga el error si ocurre
  }
};

// Función para enviar un nuevo trámite
export const crearTramite = async (tramiteData) => {
  try {
    const response = await api.post('/tramites', tramiteData);
    return response.data;  // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al crear el trámite:', error);
    throw error;
  }
};

// Agrega más funciones según lo necesites

export default api;
