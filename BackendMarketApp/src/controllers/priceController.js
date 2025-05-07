//import Event from '../models/Event.js';
import pool from '../config/db.js';
import { parseISO, isBefore, isValid } from 'date-fns';

export const createPrice = async (req, res) => {
  try {
    const {
      tiendaId,
      productoId,
      valor,
      tiempoVigenciaInicio,
      tiempoVigenciaFin,
    } = req.body;
    if (
      !tiendaId ||
      !productoId ||
      valor === undefined ||
      !tiempoVigenciaInicio ||
      !tiempoVigenciaFin
    ) {
      return res.status(400).json({ message: "Valores faltantes requeridos" });
    }

    const storeIdNum = parseInt(tiendaId, 10);
    const prodIdNum = parseInt(productoId, 10);

    if (isNaN(storeIdNum)) {
      return res.status(400).json({ message: "ID de tienda inválido (debe ser un número)." });
    }
    if (isNaN(prodIdNum)) {
      return res.status(400).json({ message: "ID de producto inválido (debe ser un número)." });
    }

    if (isNaN(parseFloat(valor)) || parseFloat(valor) < 0) {
      return res.status(400).json({ message: "Valor de precio inválido" });
    }
    const startDate = parseISO(tiempoVigenciaInicio);
    const endDate = parseISO(tiempoVigenciaFin);
    if (isNaN(startDate) || isNaN(endDate) || !isBefore(startDate, endDate)) {
      return res
        .status(400)
        .json({
          message:
            "Rango de fecha inválido. La fecha de vigencia final debe ser mayor a la fecha vigencia inicial",
        });
    }

    try {
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

      // Verificar solapamiento de fechas
      const overlapCheckQuery = `
              SELECT 1 FROM Precios
              WHERE TiendaID = ?
                AND ProductoID = ?
                AND ? < tiempoVigenciaFin 
                AND ? > tiempoVigenciaInicio
              LIMIT 1;
            `;
      const [overlapRows] = await pool.execute(overlapCheckQuery, [
        tiendaId,
        productoId,
        tiempoVigenciaInicio,
        tiempoVigenciaFin,
      ]);

      if (overlapRows.length > 0) {
        return res
          .status(409)
          .json({
            message:
              "El rango de fechas se solapa con un precio existente para el mismo producto y tienda. Por favor, revise las fechas.",
          });
      }

      // Insertando el nuevo precio
      const insertQuery = `
              INSERT INTO Precios (TiendaID, ProductoID, Valor, tiempoVigenciaInicio, tiempoVigenciaFin)
              VALUES (?, ?, ?, ?, ?);
            `;

      const tiempoVigenciaInicio_ = new Date(tiempoVigenciaInicio).toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);
      const tiempoVigenciaFin_ = new Date(tiempoVigenciaFin).toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);

      const [result] = await pool.execute(insertQuery, [
        tiendaId,
        productoId,
        parseFloat(valor),
        tiempoVigenciaInicio_,
        tiempoVigenciaFin_,
      ]);

      res.status(201).json({
        message: "Precio creado exitosamente",
        tiendaId,
        productoId,
        priceRecordId: result.insertId,
      });
    } catch (error) {
      console.error("Error al insertar el precio:", error);
      res.status(500).json({ message: "Error al insertar el precio" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
