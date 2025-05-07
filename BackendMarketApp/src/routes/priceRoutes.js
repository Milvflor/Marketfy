import express from 'express';
import { createPrice } from '../controllers/priceController.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'API de Precios Marketfy, version 1.0.0' });
});

router.post('/createPrice', createPrice);
export default router;
