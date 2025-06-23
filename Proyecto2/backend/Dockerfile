# Usar imagen oficial Node LTS
FROM node:18-alpine

# Crear carpeta app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "index.js"]
