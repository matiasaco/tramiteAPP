const fs = require("fs");
const path = require("path");
const { ftpClient, connectFTP } = require("../config/ftp");

exports.subirArchivoFTP = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No se subió ningún archivo" });

  const localFilePath = path.join(__dirname, "../uploads", req.file.filename);
  const remoteFilePath = `/tramites/${req.file.filename}`;

  try {
    await connectFTP(); // Conectar al FTP
    await ftpClient.uploadFrom(localFilePath, remoteFilePath);
    fs.unlinkSync(localFilePath); // Borrar el archivo local después de subirlo

    res.json({ message: "Archivo subido con éxito", filePath: remoteFilePath });
  } catch (error) {
    res.status(500).json({ message: "Error al subir archivo", error });
  } finally {
    ftpClient.close();
  }
};
