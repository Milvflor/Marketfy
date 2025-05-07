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

  if (!tiendaId || !productoId || promocionId === undefined || !tiempoPVigenciaInicio || !tiempoPVigenciaFin) { 
    return res.status(400).json({ message: "Valores faltantes requeridos" });
  }

  const storeIdNum = parseInt(tiendaId, 10);
  if (isNaN(storeIdNum)) {
    return res.status(400).json({ message: "ID de tienda inválido (debe ser un número)." });
  }

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
    const tiempoPVigenciaInicio_ = new Date(tiempoPVigenciaInicio).toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);
    const tiempoPVigenciaFin_ = new Date(tiempoPVigenciaFin).toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);

    // Verificar si existe Tienda
    const checkStoreQuery = 'SELECT 1 FROM Tiendas WHERE TiendaID = ? LIMIT 1;';
    const [storeRows] = await pool.execute(checkStoreQuery, [storeIdNum]);
    if (storeRows.length === 0) {
        return res.status(404).json({ 
            message: `La tienda con ID '${storeIdNum}' no existe.`
        });
    }

    // Verificar si existe Producto
    const checkProductQuery = 'SELECT 1 FROM Productos WHERE ProductoID = ? LIMIT 1;';
    const [productRows] = await pool.execute(checkProductQuery, [prodIdNum]);
    if (productRows.length === 0) {
        return res.status(404).json({
            message: `El producto con ID '${prodIdNum}' no existe.`
        });
    }

    const insertQuery = `
      INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin)
      VALUES (?, ?, ?, ?, ?);
    `;
    // Usar el ID numérico de promoción validado
    const [result] = await pool.execute(insertQuery, [
        tiendaId,
        prodIdNum,
        promoIdNum,
        tiempoPVigenciaInicio_,
        tiempoPVigenciaFin_
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
