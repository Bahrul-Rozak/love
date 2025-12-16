const express = require("express");
const app = express();
const mysql = require("mysql2");
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const port = 3000;


// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Koneksi ke database BERHASIL!");
  })
  .catch((err) => {
    console.log("Gagal terhubung ke database:", err.message);
    // process.exit(1);
  });
