require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "empresa_transporte",
  waitForConnections: true,
  connectionLimit: 10
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ok:true, message:"API y MySQL conectados"});
  } catch (error) {
    res.status(500).json({ok:false, message:"No se pudo conectar a MySQL", error:error.message});
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const {nombre, email, rol, password} = req.body;
    if (!nombre || !email || !password) return res.status(400).json({message:"Nombre, correo y contraseña son obligatorios."});

    const [exists] = await pool.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
    if (exists.length) return res.status(409).json({message:"El correo ya está registrado."});

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, rol, password_hash) VALUES (?, ?, ?, ?)",
      [nombre, email, rol || "Cliente", hash]
    );

    res.status(201).json({message:"Usuario registrado correctamente.", id_usuario:result.insertId});
  } catch (error) {
    res.status(500).json({message:"Error al registrar usuario.", error:error.message});
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const [rows] = await pool.query(
      "SELECT id_usuario, nombre, email, rol, password_hash FROM usuarios WHERE email = ?",
      [email]
    );

    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({message:"Correo o contraseña incorrectos."});
    }

    const {password_hash, ...user} = rows[0];
    res.json({user});
  } catch (error) {
    res.status(500).json({message:"Error al iniciar sesión.", error:error.message});
  }
});

app.get("/api/clientes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_cliente, nombre, documento, direccion, telefono FROM clientes ORDER BY id_cliente");
    res.json(rows);
  } catch (error) {
    res.status(500).json({message:"Error consultando clientes.", error:error.message});
  }
});

app.post("/api/clientes", async (req, res) => {
  try {
    const {nombre, documento, direccion, telefono} = req.body;
    const [result] = await pool.query(
      "INSERT INTO clientes (nombre, documento, direccion, telefono) VALUES (?, ?, ?, ?)",
      [nombre, documento, direccion, telefono]
    );
    res.status(201).json({id_cliente:result.insertId, message:"Cliente creado correctamente."});
  } catch (error) {
    res.status(500).json({message:"Error creando cliente.", error:error.message});
  }
});

app.get("/api/envios", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_envio, remision, ciudad_despacho, ciudad_destino, estado FROM envios ORDER BY id_envio"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({message:"Error consultando envíos.", error:error.message});
  }
});

app.post("/api/envios", async (req, res) => {
  try {
    const {remision, ciudad_despacho, ciudad_destino, estado} = req.body;
    const [result] = await pool.query(
      "INSERT INTO envios (remision, ciudad_despacho, ciudad_destino, estado) VALUES (?, ?, ?, ?)",
      [remision, ciudad_despacho, ciudad_destino, estado]
    );
    res.status(201).json({id_envio:result.insertId, message:"Envío creado correctamente."});
  } catch (error) {
    res.status(500).json({message:"Error creando envío.", error:error.message});
  }
});

app.get("/api/asesores", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_asesor, nombre, documento, empresa, cargo FROM asesores ORDER BY id_asesor"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({message:"Error consultando asesores.", error:error.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});
