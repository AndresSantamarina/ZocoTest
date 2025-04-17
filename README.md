# 📦 Zoco - Prueba Técnica

Este es un proyecto desarrollado con **React** para el frontend y **JSON Server** como backend simulado. La app permite realizar el login de un usuario, que puede tener dos roles:

- Administrador
- Usuario normal

El administrador puede visualizar la información de los usuarios registrados, crear usuarios, editar y eliminar sus datos.

El usuario normal puede visualizar sus propios datos y editar/eliminar sus estudios y direcciones.

## 🚀 Deploy del proyecto

🔗 [https://zoco-test.vercel.app](https://zoco-test.vercel.app)

## ⚙️ Cómo correr el proyecto localmente

1. Clonar este repositorio:
   ```bash
   git clone https://github.com/AndresSantamarina/ZocoTest.git
   cd tu-repositorio
2. Instalar las dependencias:
    ```bash
   npm install
3. Iniciar el servidor de desarrollo del frontend:
    ```bash
   npm run dev
4. En otra terminal, iniciar el servidor del backend (JSON Server)
    ```bash
   npm run server

✅ La aplicación debería estar disponible en http://localhost:5173 y el backend en http://localhost:3001.