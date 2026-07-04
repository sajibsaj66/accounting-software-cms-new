import mysql from "mysql2/promise";

let pool;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "",
      database:
        process.env.DB_NAME || process.env.DB_DATABASE || "sbmoffic_sharif_bearing",
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }

  return pool;
}
