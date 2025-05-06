import express from 'express';
import { createPrice } from '../controllers/priceController.js';
import { createPromotionDefinition, createPromotionApplication} from '../controllers/promotionController.js'
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'API de eventos de Walletfy, version 1.0.0' });
});

router.post('/createPrice', createPrice);
router.post('/createPromotionDefinition', createPromotionDefinition);
router.post('/createPromotionApplication',createPromotionApplication);
export default router;
