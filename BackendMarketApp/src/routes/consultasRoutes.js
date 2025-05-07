import express from 'express';
import { getFinalPrice, getAllStores } from '../controllers/consultasController.js'
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'API de Consultas Generales Marketfy, version 1.0.0' });
});

router.get('/queries/final-price', getFinalPrice);
router.get('/allStores', getAllStores);

export default router;
