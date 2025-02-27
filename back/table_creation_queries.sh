#!/bin/bash

# Read the database name from a file
DB_NAME=$(<db_name.txt)

# Create the database
createdb "$DB_NAME"

psql -d "$DB_NAME" -c "
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    rol VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX unique_usuario
ON usuarios (usuario)
WHERE eliminado = false;
"

psql -d "$DB_NAME" -c "
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    total_pesos NUMERIC NOT NULL,
    total_usd NUMERIC NOT NULL,
    productos JSONB NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    medio_de_pago VARCHAR(255) NOT NULL,
    tipo_venta VARCHAR(255) NOT NULL,
    usuario VARCHAR(255) NOT NULL,
    eliminada BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (usuario) REFERENCES usuarios(usuario)
);
"

psql -d "$DB_NAME" -c "
CREATE TABLE caja (
    id SERIAL PRIMARY KEY,
    fecha_ingreso TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    monto NUMERIC,
    usuario VARCHAR(255) NOT NULL,
    accion VARCHAR(255) NOT NULL,
    FOREIGN KEY (usuario) REFERENCES usuarios(usuario)
);
"

psql -d "$DB_NAME" -c "
CREATE TABLE egresos (
    id SERIAL PRIMARY KEY,
    fecha_egreso TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    monto NUMERIC NOT NULL,
    rubro VARCHAR(255) NOT NULL,
    descripcion TEXT,
    usuario VARCHAR(255) NOT NULL,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE,
    pendiente BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (usuario) REFERENCES usuarios(usuario)
);
"

psql -d "$DB_NAME" -c "
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio_pesos NUMERIC NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    costo_pesos NUMERIC NOT NULL,
    cantidad NUMERIC NOT NULL,
    rubro VARCHAR(255) NOT NULL,
    stock VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX unique_codigo_not_eliminado
ON productos (codigo,local)
WHERE eliminado = false;
"

psql -d "$DB_NAME" -c "
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    rubro VARCHAR(100),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE
);
"

psql -d "$DB_NAME" -c "
CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    cantidad NUMERIC NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    agregar BOOLEAN NOT NULL,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (nombre, local) REFERENCES stock_valores(nombre, local)
);
"

# Cantidad puede ser positivo o negativo segun corresponda
psql -d "$DB_NAME" -c "
CREATE TABLE correcciones_caja (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    local VARCHAR(255) NOT NULL,
    cantidad NUMERIC NOT NULL
);
"

# Cantidad puede ser positivo o negativo segun corresponda
psql -d "$DB_NAME" -c "
CREATE TABLE stock_valores (
    id SERIAL PRIMARY KEY,
    local VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    cantidad NUMERIC,
    UNIQUE (nombre, local)
);
"

# Create temporal admin user.
curl -X POST http://localhost:3003/api/usuarios/create -H "Content-Type: application/json" -d '{
  "local": "sampleLocal",
  "usuario": "admin",
  "clave": "admin",
  "rol": "admin",
  "nombre": "Admin",
  "apellido": "User",
  "telefono": "1234567890",
  "documento": "12345678"
}'

echo "Database and tables created successfully."
