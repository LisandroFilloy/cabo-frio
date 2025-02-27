#!/bin/bash

# Detener el script si ocurre un error
set -e

# Cambiar al directorio del repositorio
cd ~/code/cabo-frio-lode/cabo-frio-front

# Descargar los últimos cambios desde Git
echo "Fetching latest changes from Git..."
git pull

# Instalar nuevas dependencias
echo "Installing dependencies..."
npm install

# Construir el proyecto (detendrá el script si hay errores)
echo "Building the project..."
npm run build

if [ ! -d "dist" ]; then
    echo "Build failed. Directory 'dist' not found."
    exit 1
fi

# Asegurar que el directorio de Nginx existe
echo "Ensuring Nginx directory exists..."
sudo mkdir -p /usr/share/nginx/html/cabo-frio-front/

# Eliminar archivos existentes en el directorio de Nginx
echo "Removing old build files..."
sudo rm -rf /usr/share/nginx/html/cabo-frio-front/*

# Mover los archivos construidos al directorio de Nginx
echo "Moving built files to Nginx directory..."
sudo mv dist/* /usr/share/nginx/html/cabo-frio-front/

# Reiniciar Nginx para aplicar los cambios
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Mensaje de éxito
echo "Deployment completed successfully."
