import pool from '../config/db.js';
import { parseISO, isValid } from 'date-fns';

export const getFinalPrice = async (req, res, next) => {
    const { tiendaId, productoId, datetime } = req.query;

    const prodIdNum = parseInt(productoId, 10);
     if (isNaN(prodIdNum)) {
        return res.status(400).json({ message: 'ID de producto inválido.' });
     }
     const queryDate = parseISO(datetime);
     if (!isValid(queryDate)) {
        return res.status(400).json({ message: 'Fecha y hora inválidas.' });
     }
     const mysqlDateTime = queryDate.toISOString().slice(0, 19).replace('T', ' ');
  
    try {
      // --- Obtener Precio Base ---
      const priceQuery = `SELECT Valor FROM Precios WHERE TiendaID = ? AND ProductoID = ? AND ? >= tiempoVigenciaInicio AND ? < tiempoVigenciaFin LIMIT 1;`;
      const [priceRows] = await pool.execute(priceQuery, [tiendaId, prodIdNum, mysqlDateTime, mysqlDateTime]);
      if (priceRows.length === 0) { 
        return res.status(404).json({ message: 'No se encontró un precio válido para el producto en la tienda.' });
       }
      const basePrice = parseFloat(priceRows[0].Valor);
  
      // --- Obtener Promociones Activas ---
      // La consulta une por el PromocionID numérico
      const promoAppQuery = `
        SELECT pa.PromocionID, pd.PorcentajeDescuento
        FROM Promociones_Aplicacion pa
        JOIN Promocion_Definiciones pd ON pa.PromocionID = pd.PromocionID
        WHERE pa.TiendaID = ? AND pa.ProductoID = ? AND ? >= pa.tiempoPVigenciaInicio AND ? < pa.tiempoPVigenciaFin;
      `;
      const [promoRows] = await pool.execute(promoAppQuery, [tiendaId, prodIdNum, mysqlDateTime, mysqlDateTime]);
  
      let finalPrice = basePrice;
      let bestDiscount = 0;
      let appliedPromotionId = null; // Será numérico
  
      if (promoRows.length > 0) {
          promoRows.forEach(promo => {
              const currentDiscount = parseFloat(promo.PorcentajeDescuento);
              if (currentDiscount > bestDiscount) {
                  bestDiscount = currentDiscount;
                  appliedPromotionId = promo.PromocionID; // ID numérico
              }
          });
          // ... Cálculo del precio final ...
          finalPrice = Math.round((basePrice * (1 - (bestDiscount / 100.0))) * 100) / 100;
      }
  
      res.status(200).json({
        finalPrice: finalPrice,
        basePrice: basePrice,
        appliedPromotionId: appliedPromotionId, // ID numérico o null
        discountPercentage: bestDiscount > 0 ? bestDiscount : null,
        queryDateTime: datetime
      });
  
    } catch (err) {
      console.error("Error calculating final price:", err);
      next(err);
    }
  };
  