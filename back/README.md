## Creation
- Node.js project

## Deploy 
- Tener postgresql instalado en el sv (linux: apt-get install postgresql).
- Create user in postgresql if it doesn't exist:
    - acces postgres user: >sudo -i -u postgres
    - access psql CLI: >psql
    - create user: >CREATE USER licha WITH SUPERUSER PASSWORD 'password';
- create and checkout new branch
- give db_name.txt a custom name.
- put correct username and password in server.js / postgres connection code.
- Run npm install.
- Run table_creation_queries.sh
- Configure NGINX to point to the branch.

## Mejoras futuras 
- Agregar condicion para evitar dropear tablas de postgresql sin confirmacion. Investigar solucion robusta.
