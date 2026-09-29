CREATE DATABASE IF NOT EXISTS empresa_transporte
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE empresa_transporte;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    rol ENUM('Trabajador','Cliente') NOT NULL DEFAULT 'Cliente',
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(30) NOT NULL UNIQUE,
    direccion VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS envios (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    remision VARCHAR(30) NOT NULL UNIQUE,
    ciudad_despacho VARCHAR(80) NOT NULL,
    ciudad_destino VARCHAR(80) NOT NULL,
    estado VARCHAR(40) NOT NULL DEFAULT 'en bodega'
);

CREATE TABLE IF NOT EXISTS asesores (
    id_asesor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(30) NOT NULL UNIQUE,
    empresa VARCHAR(150) NOT NULL,
    cargo VARCHAR(100) NOT NULL
);

-- Registros de ejemplo basados en la imagen
INSERT IGNORE INTO clientes (id_cliente, nombre, documento, direccion, telefono) VALUES
(1, 'juan garcia', '127367374', 'calle 47 # 12-07', '3127364738'),
(2, 'andrea guerra', '282938742', 'cra 13 # 8-23', '3213479003');

INSERT IGNORE INTO envios (id_envio, remision, ciudad_despacho, ciudad_destino, estado) VALUES
(3, '1283736', 'medellin', 'bogota', 'enviado'),
(4, '328462', 'medellin', 'armenia', 'en bodega');

INSERT IGNORE INTO asesores (id_asesor, nombre, documento, empresa, cargo) VALUES
(5, 'juliana castro', '127383633', 'transporte de personas y cosas', 'asesor comercial'),
(6, 'vanesa lopera', '382983743', 'transporte de personas y cosas', 'asesor comercial');
