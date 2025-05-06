import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import eventRoutes from './src/routes/eventRoutes.js';
import pool from './src/config/db.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Conectar a la base de datos
const connectDB = async () => {
    let conexion = null;
    try {
        conexion = await pool.getConnection();

        const [filas] = await conexion.query('SELECT NOW() AS fecha_actual');
        
        if(filas.length > 0) {
            console.log('Conexión exitosa a MySQL', filas[0].fecha_actual);
        }else {
            throw new Error('No se pudo realizar la conexión a la base de datos');
        }
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error.message);
        process.exit(1);
    } finally {
        if (conexion) {
            await conexion.release();
            console.log('Conexión de verificación liberada.');
        }
    }
};

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(limiter);
app.use(helmet());

const swaggerDocument = YAML.load(path.join(__dirname, './src/docs/swagger.yaml'));

app.get('/', (req, res) => {
    res.json({
        message: 'Hola, bienvenido a Marketfy API',
        version: '1.0.0',
    });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/market', eventRoutes);

await connectDB();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


