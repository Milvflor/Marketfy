//import Event from '../models/Event.js';

export const createPrice = async (req, res) => {
  try {
    const {
      tiendaId,
      productoId,
      versionPrecio,
      valor,
      tiempoVigenciaInicio,
      tiempoVigenciaFin,
    } = req.body;
    if (
      !tiendaId ||
      !productoId ||
      !versionPrecio ||
      valor === undefined ||
      !tiempoVigenciaInicio ||
      !tiempoVigenciaFin
    ) {
      return res.status(400).json({ message: "Valores faltantes requeridos" });
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
      // Consulta para verificar solapamiento de fechas
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
              INSERT INTO Precios (TiendaID, ProductoID, VersionPrecio, Valor, tiempoVigenciaInicio, tiempoVigenciaFin)
              VALUES (?, ?, ?, ?, ?, ?);
            `;

      const [result] = await pool.execute(insertQuery, [
        tiendaId,
        productoId,
        versionPrecio,
        parseFloat(valor),
        tiempoVigenciaInicio,
        tiempoVigenciaFin,
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
