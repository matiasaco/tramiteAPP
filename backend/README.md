# 📌 Backend

## 🛠️ Configuración e Instalación

```sh
cd backend
npm install
```

## 🔑 Variables de Entorno (`backend/.env`)

````env
# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASS=Agus4254.
DB_NAME=tramites_db

# Configuración del servidor FTP
FTP_HOST=127.0.0.1
FTP_USER=tramites_ftp
FTP_PASS=Agus4254.
FTP_PORT=21
FTP_FOLDER=/uploads

# JWT para autenticación
JWT_SECRET=supersecreto

# Configuración de correo electrónico
EMAIL_HOST=
EMAIL_USER=matias.acostaag@gmail.com
EMAIL_PASS=knax haws eboc xsxf # Clave de aplicación de Google

## ▶️ Ejecutar Servidor

```sh
npm start
````

## 📡 Endpoints

- `POST /api/tramites` - Crear trámite
- `GET /api/tramites` - Obtener trámites
- `PUT /api/tramites/:id` - Actualizar estado

---
