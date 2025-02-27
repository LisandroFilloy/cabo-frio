# Project
- Build Tool: Vite 
- web framework: React+ Typescript
- CSS Framework: Tailwind CSS

# Deploy

- deploy backend
- clone repo
- checkout a new branch
- set values in /src/ListaLocales.ts
- add an nginx config like:
nginx config - with CORS enabled - expose port 805:

server {
    listen 805;
    server_name localhost;

    root /usr/share/nginx/html/cabo-frio-front;
    index index.html;

    location / {
        # Add CORS headers
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization';
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Length' 0;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            return 204;
        }

        try_files $uri $uri/ =404;
    }
}

- create symlink in sites-enabled: >sudo ln -s /etc/nginx/sites-available/cabo-frio-front /etc/nginx/sites-enabled/
- run deploy.sh (correctly configure before).



# Mejoras futuras

- Boton en caja para "Limpiar caja"? La caja nunca cierra perfecto.
- Medida de seguridad: hay requests que solo pueden mandar los admin, pero si un empleado mandara un curl request "adivinando" el post con su token copiado y pegado podria bypassear la seguridad. Esto se evita controlando desde el back que el JWT enviado corresponde a un amdin para estos requests.
- responsiveness pagina stock (detalles).
- Idea para mostrar app a clientes: Setearle en un sitio web con sus tablas aparte y reiniciar las tablas todos los dias.
- Poder re-imprimir los tickets desde /ventas/ventas-del-dia
- Optional: use a memory caching system like memcached or reddis to cache data.
- Change Cancelar button in action bar, and remove state variable instead of reloading page.
