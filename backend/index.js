const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const { connectFTP } = require("./config/ftp");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas (se agregarán después)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tramites", require("./routes/tramitesRoutes"));

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await connectFTP();
});
