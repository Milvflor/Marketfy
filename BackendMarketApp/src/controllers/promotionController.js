import pool from '../config/db.js';
import { parseISO, isBefore, isValid } from 'date-fns';

export const createPromotionDefinition = async (req, res, next) => {
  const { porcentajeDescuento } = req.body;

  if (porcentajeDescuento === undefined) {
      return res.status(400).json({ message: 'Valores faltantes requeridos' });
   }
  const discount = parseFloat(porcentajeDescuento);
  if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({ message: 'Valor de descuento inválido. Debe ser entre 0 y 100.' });
   }

   try {
      const query = 'INSERT INTO Promocion_Definiciones (PorcentajeDescuento) VALUES (?);';
      const [result] = await pool.execute(query, [discount]);
      res.status(201).json({
          message: 'Promotion definition created.',
          promocionId: result.insertId 
      });
  } catch(err) {
      console.error("Error creando promoción: ", err);
      next(err);
   }
};


export const createPromotionApplication = async (req, res, next) => {

  const { tiendaId, productoId, promocionId, tiempoPVigenciaInicio, tiempoPVigenciaFin } = req.body;

  if (!tiendaId || !productoId || promocionId === undefined || !tiempoPVigenciaInicio || !tiempoPVigenciaFin) { /* ... error ... */ }
   const promoIdNum = parseInt(promocionId, 10);
   if (isNaN(promoIdNum)) {
      return res.status(400).json({ message: 'ID de promoción inválido.' });
   }
   const prodIdNum = parseInt(productoId, 10);
   if (isNaN(prodIdNum)) {
      return res.status(400).json({ message: 'ID de producto inválido.' });
   }
   const startDate = parseISO(tiempoPVigenciaInicio);
   const endDate = parseISO(tiempoPVigenciaFin);
   if (isNaN(startDate) || isNaN(endDate) || !isBefore(startDate, endDate)) {
      return res.status(400).json({
          message: 'Rango de fecha inválido. La fecha de vigencia final debe ser mayor a la fecha vigencia inicial.',
      });
   }

  try {
    const insertQuery = `
      INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin)
      VALUES (?, ?, ?, ?, ?);
    `;
    // Usa el ID numérico de promoción validado
    const [result] = await pool.execute(insertQuery, [
        tiendaId,
        prodIdNum,
        promoIdNum, // ID numérico
        tiempoPVigenciaInicio,
        tiempoPVigenciaFin
    ]);

    res.status(201).json({
      message: 'Promoción aplicada correctamente.',
      aplicacionId: result.insertId
    });
  } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') { /* ... error FK ... */ }
      console.error("Error creating promotion application:", err);
      next(err);
  }
};
