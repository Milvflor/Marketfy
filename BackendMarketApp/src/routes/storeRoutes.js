import express from 'express';
const router = express.Router();
import { createStore } from '../controllers/storeController.js'

router.get('/', (req, res) => {
    res.json({ message: 'API de Tienda de Marketfy, version 1.0.0' });
});

router.post('/createStore', createStore);
export default router;
