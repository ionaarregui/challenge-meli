# Challenge Meli - Frontend

Este proyecto es una aplicación web desarrollada con React, TypeScript y Vite que simula la funcionalidad de búsqueda y visualización de productos de Mercado Libre.

## 🚀 Tecnologías Utilizadas

### Frontend (Cliente)
- **React 19** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de construcción rápida para desarrollo
- **React Router DOM** - Enrutamiento para aplicaciones React
- **Sass/SCSS** - Preprocesador de CSS con CSS Modules
- **ESLint + Prettier** - Linting y formateo de código

### Backend (Servidor)
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **Nodemon** - Reinicio automático del servidor en desarrollo

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)


## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd challenge-meli
```

### 2. Configurar variables de entorno

#### Cliente
```bash
cd client
cp env.example .env
```

#### Servidor
```bash
cd ../server
cp env.example .env
```

### 3. Instalar dependencias
```bash
npm install:all
```


## 🚀 Ejecución

### Opción 2: Ejecutar ambos simultáneamente

```bash
npm start
```
El cliente se ejecutará en: **http://localhost:3000**
El servidor se ejecutará en: **http://localhost:8080**

### Opción 2: Ejecutar por separado

#### Cliente (Frontend)
```bash
cd client
npm start
```
El cliente se ejecutará en: **http://localhost:3000**

#### Servidor (Backend)
```bash
cd server
npm start
```
El servidor se ejecutará en: **http://localhost:8080**

## 📁 Estructura del Proyecto

```
challenge-meli/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # Definiciones TypeScript
│   │   ├── contexts/      # Contextos de React
│   │   └── Layout/        # Layout principal
│   ├── package.json
│   └── vite.config.ts
├── server/                # Backend Express
│   ├── mocks/            # Datos simulados
│   ├── index.js          # Servidor principal
│   └── package.json
└── README.md
```

## 🔧 Variables de Entorno

### Cliente (.env)
```bash
VITE_CLIENT_PORT=3000          # Puerto del servidor de desarrollo del cliente
VITE_SERVER_PORT=8080          # Puerto del servidor backend
VITE_API_BASE_URL=http://localhost:8080  # URL base para las peticiones a la API
```

### Servidor (.env)
```bash
SERVER_PORT=8080               # Puerto del servidor backend
CLIENT_PORT=3000               # Puerto del cliente (para CORS)
CLIENT_URL=http://localhost:3000  # URL del cliente (para CORS)
```
## 🌐 Endpoints del API

### Búsqueda de productos
```
GET http://localhost:8080/items?search=<término>
```

### Detalle de producto
```
GET http://localhost:8080/items/:id
```

## 🎯 Funcionalidades

- **Búsqueda de productos** - Filtrado por título y categorías
- **Listado de productos** - Vista con cards de productos
- **Detalle de producto** - Vista completa con información detallada

## 🎨 Características de la UI

- **Componentes modulares** - Estructura organizada y reutilizable
- **CSS Modules** - Estilos encapsulados por componente
- **TypeScript** - Tipado estático para mayor robustez
- **React Router** - Navegación entre páginas
- **Context API** - Gestión de estado global

## 🐛 Solución de Problemas

### Error de puerto ocupado
Si el puerto 3000 o 8080 están ocupados, puedes cambiar los puertos editando los archivos `.env`:

**Cliente (.env):**
```bash
VITE_CLIENT_PORT=3001
VITE_SERVER_PORT=8081
VITE_API_BASE_URL=http://localhost:8081
```

**Servidor (.env):**
```bash
SERVER_PORT=8081
CLIENT_PORT=3001
CLIENT_URL=http://localhost:3001
```

### Error de CORS
El servidor está configurado automáticamente para aceptar requests desde la URL del cliente definida en las variables de entorno. Si cambias los puertos, asegúrate de actualizar ambos archivos `.env`.

## 📝 Notas

- Los datos son simulados y se encuentran en `server/mocks/`
- El proyecto está configurado para desarrollo local usando variables de entorno
- Para producción, considera configurar variables de entorno específicas del entorno
- Asegúrate de que ambos servicios (cliente y servidor) estén ejecutándose para el funcionamiento completo
- Las variables de entorno permiten cambiar fácilmente los puertos sin modificar el código


