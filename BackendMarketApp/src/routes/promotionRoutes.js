import express from 'express';
import { createPrice } from '../controllers/priceController.js';
import { createPromotionDefinition, createPromotionApplication} from '../controllers/promotionController.js'
import { getFinalPrice } from '../controllers/consultasController.js'
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'API de Promociones de Marketfy, version 1.0.0' });
});

router.post('/definitions', createPromotionDefinition);
router.post('/applications',createPromotionApplication);
export default router;
