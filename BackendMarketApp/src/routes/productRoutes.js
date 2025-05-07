import express from 'express';
import { createProduct } from '../controllers/productController.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'API de Productos de Marketfy, version 1.0.0' });
});

router.post('/createProduct', createProduct);
export default router;
