# Backend Videojuegos - API con Node.js y Redis

Este backend implementa una API REST para gestionar usuarios, videojuegos y reseñas usando Redis como base de datos, y está contenerizado con Docker.

---

## Requisitos previos

- Tener instalado [Docker](https://www.docker.com/get-started)
- Tener instalado [Docker Compose](https://docs.docker.com/compose/install/) 
- Redis correrá en un contenedor gestionado por Docker Compose

---

## Levantar la aplicación con Docker Compose 

1. Navegar a la carpeta del backend en Proyecto 2:
   cd backend

2. Levantar los servicios (backend + redis) en segundo plano:
docker-compose up -d --build
 
3. Verificar que estén corriendo:
docker-compose ps

4. Para detener los servicios:
docker-compose down

# Crear un usuario administrador para las pruebas con la siguiente estructura
 {
  "username": "",
  "email": "",
  "password_hash": "",
  "role": "admin"
}
