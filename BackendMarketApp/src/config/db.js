import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
let pool;

try {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
    });
    console.log('Pool de conexión a MySQL creado');
    } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
    }

export default pool;