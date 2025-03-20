require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const tramiteRoutes = require("./routes/tramitesRoutes");
const authRoutes = require("./routes/authRoutes"); // Importar rutas de autenticación
const db = require("./config/db"); // Importamos la conexión MySQL

const app = express(); 
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// 🔹 Agregar las rutas después de inicializar Express
app.use("/api/tramites", tramiteRoutes);
app.use("/api/auth", authRoutes); // Agregar rutas de autenticación

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("✅ Conexión exitosa a MySQL");
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

