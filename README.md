# Dulce Tentación (Backend)

Sistema web para la gestión integral de tiendas de repostería, automatizando procesos y mejorando la experiencia del cliente.

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Tecnologías

- **Node.js** con **NestJS**
- **MySQL** - Base de datos
- **JWT** - Autenticación y autorización
- **Dotenv** - Variables de entorno
- **CORS** - Configuración de seguridad
- **Gmail API** - Autenticación de usuarios

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [MySQL](https://www.mysql.com/) (v8.0 o superior)
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/) (se instalará en el proceso)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/blaze-darck/reposteria_backend.git
```

### 2. Navegar al directorio del proyecto

```bash
cd reposteria_backend
```

### 3. Instalar pnpm (si no lo tienes)

```bash
npm install -g pnpm
```

### 4. Instalar dependencias

```bash
pnpm install
```

## Configuración

### 1. Crear la base de datos

Abre tu cliente MySQL y ejecuta:

```sql
CREATE DATABASE reposteria_db;
USE reposteria_db;
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=contrasena_base_datos
DB_NAME=nombre_base_datos
DB_SYNC=true
DB_LOGGING=true

#Verificacion por correo

EMAIL_USUARIO= correo_electronico
EMAIL_PASSWORD=contraseña_correo
SERVICIO=gmail
```

## Ejecución

### Iniciar el servidor en modo desarrollo con las seeds

```bash
pnpm run start
```

El servidor estará disponible en: `http://localhost:3000`

## 👥 Autor

- **Blaze Darck** - [GitHub](https://github.com/blaze-darck)

Si este proyecto te fue útil, considera darle una estrella en GitHub
