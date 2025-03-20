const ftp = require("basic-ftp");
const dotenv = require("dotenv");

dotenv.config();

const ftpClient = new ftp.Client();
ftpClient.ftp.verbose = true;

async function connectFTP() {
  try {
    await ftpClient.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: false, // Cambia a true si tu FTP usa SSL
    });
    console.log("Conectado al servidor FTP");
  } catch (error) {
    console.error("Error conectando al FTP:", error);
  }
}

module.exports = { ftpClient, connectFTP };
