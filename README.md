# Libros y Autores - Prueba Técnica

Este repositorio contiene una aplicación fullstack desarrollada para la prueba técnica de Grupo Euro.

## 🧠 Estructura del Proyecto

```
libros-autores-app/
│
├── README.md                   # Explica cómo correr backend y frontend
├── .gitignore                  # Ignora carpetas como /node_modules y /bin
│
├── backend/                    # Proyecto API REST .NET 8
│   ├── BookApi.sln
│   ├── BookApi/
│   │   ├── Controllers/
│   │   ├── DTOs/
│   │   ├── Entities/
│   │   ├── Interfaces/
│   │   ├── Services/
│   │   ├── Data/
│   │   ├── appsettings.json
│   │   └── Program.cs
│
├── frontend/                   # Proyecto React.js
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       └── App.jsx
│
├── db/
│   ├── init.sql                # Script de creación de tablas
│   └── insert_sample.sql       # Datos de ejemplo
```

## 🚀 Instrucciones de uso

### Backend

1. Instalar [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
2. Ir al proyecto:
```bash
cd backend/BookApi
dotnet run
```

### Frontend

1. Requiere Node.js y npm.
2. Instalar dependencias y ejecutar:
```bash
cd frontend
npm install
npm start
```

### Base de Datos

1. Abrir `db/init.sql` y ejecutarlo en SQL Server Management Studio (SSMS).
2. Agregar datos opcionales desde `insert_sample.sql`.

---

## 📫 Contacto

Proyecto desarrollado por [Tu Nombre Aquí] para Grupo Euro.
