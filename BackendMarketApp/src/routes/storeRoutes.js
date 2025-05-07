import express from 'express';
const router = express.Router();
import { createStore, getStores } from '../controllers/storeController.js'

router.get('/', (req, res) => {
    res.json({ message: 'API de Tienda de Marketfy, version 1.0.0' });
});

router.get('/stores', getStores);
router.post('/createStore', createStore);
export default router;
