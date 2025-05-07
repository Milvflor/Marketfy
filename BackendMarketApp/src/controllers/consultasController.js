import pool from '../config/db.js';
import { parseISO, isValid } from 'date-fns';

export const getAllStores = async (req, res, next) => {
  const rawPage = req.query.page;
  const rawLimit = req.query.limit;

  let page = parseInt(rawPage, 10);
  let limit = parseInt(rawLimit, 10);

  if (isNaN(page) || page < 1) {
      page = 1;
  }
  if (isNaN(limit) || limit < 1) {
      limit = 5;
  }
  if (limit > 100) {
      limit = 100;
  }

  const offset = (page - 1) * limit;

  try {
      const storesQuery = `SELECT TiendaID, NombreTienda FROM Tiendas ORDER BY TiendaID ASC LIMIT ${limit} OFFSET ${offset};`;

      const [stores] = await pool.execute(storesQuery); 

      const countQuery = 'SELECT COUNT(*) AS totalItems FROM Tiendas;';
      const [countResult] = await pool.execute(countQuery);
      const totalItems = countResult[0].totalItems;
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({
          message: 'Tiendas obtenidas exitosamente.',
          data: stores,
          pagination: {
              currentPage: page,
              itemsPerPage: limit,
              totalItems: totalItems,
              totalPages: totalPages,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1 && totalItems > 0 
          }
      });
  } catch (error) {
      console.error("Error obteniendo tiendas:", error);
      next(error);
  }
};

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
                  appliedPromotionId = promo.PromocionID; 
              }
          });
          finalPrice = Math.round((basePrice * (1 - (bestDiscount / 100.0))) * 100) / 100;
      }
  
      res.status(200).json({
        finalPrice: finalPrice,
        basePrice: basePrice,
        appliedPromotionId: appliedPromotionId,
        queryDateTime: datetime
      });
  
    } catch (err) {
      console.error("Error calculating final price:", err);
      next(err);
    }
  };
  
export const getFinalPriceProducts = async (req, res, next) => {
    const { datetime, tiendaId, productoId } = req.query;
    const queryDate = parseISO(datetime);
    
    if (!isValid(queryDate)) {
        return res.status(400).json({ message: 'Fecha y hora inválidas.' });
    }

    // Validar IDs si se proporcionan
    if (tiendaId && isNaN(parseInt(tiendaId, 10))) {
        return res.status(400).json({ message: 'ID de tienda inválido.' });
    }
    if (productoId && isNaN(parseInt(productoId, 10))) {
        return res.status(400).json({ message: 'ID de producto inválido.' });
    }
    
    const mysqlDateTime = queryDate.toISOString().slice(0, 19).replace('T', ' ');

    try {
        const query = `
            WITH PreciosVigentes AS (
                SELECT 
                    p.ProductoID,
                    p.NombreProducto,
                    t.TiendaID,
                    t.NombreTienda,
                    pr.Valor as PrecioBase,
                    pr.tiempoVigenciaInicio,
                    pr.tiempoVigenciaFin,
                    ROW_NUMBER() OVER (
                        PARTITION BY p.ProductoID, t.TiendaID 
                        ORDER BY pr.tiempoVigenciaInicio DESC
                    ) as rn
                FROM Productos p
                CROSS JOIN Tiendas t
                LEFT JOIN Precios pr ON pr.ProductoID = p.ProductoID 
                    AND pr.TiendaID = t.TiendaID
                    AND ? BETWEEN pr.tiempoVigenciaInicio AND pr.tiempoVigenciaFin
                WHERE 1=1
                    ${tiendaId ? 'AND t.TiendaID = ?' : ''}
                    ${productoId ? 'AND p.ProductoID = ?' : ''}
            ),
            PromocionesVigentes AS (
                SELECT 
                    pa.ProductoID,
                    pa.TiendaID,
                    pd.PromocionID,
                    pd.PorcentajeDescuento,
                    pa.tiempoPVigenciaInicio,
                    pa.tiempoPVigenciaFin,
                    ROW_NUMBER() OVER (
                        PARTITION BY pa.ProductoID, pa.TiendaID 
                        ORDER BY pd.PorcentajeDescuento DESC
                    ) as rn
                FROM Promociones_Aplicacion pa
                JOIN Promocion_Definiciones pd ON pa.PromocionID = pd.PromocionID
                WHERE ? BETWEEN pa.tiempoPVigenciaInicio AND pa.tiempoPVigenciaFin
                    ${tiendaId ? 'AND pa.TiendaID = ?' : ''}
                    ${productoId ? 'AND pa.ProductoID = ?' : ''}
            )
            SELECT 
                pv.ProductoID,
                pv.NombreProducto,
                pv.TiendaID,
                pv.NombreTienda,
                pv.PrecioBase,
                pv.tiempoVigenciaInicio as PrecioVigenciaInicio,
                pv.tiempoVigenciaFin as PrecioVigenciaFin,
                COALESCE(prom.PorcentajeDescuento, 0) as DescuentoMaximo,
                CASE 
                    WHEN prom.PorcentajeDescuento IS NOT NULL 
                    THEN ROUND(pv.PrecioBase * (1 - prom.PorcentajeDescuento / 100), 2)
                    ELSE pv.PrecioBase 
                END as PrecioFinal,
                prom.PromocionID,
                prom.tiempoPVigenciaInicio as PromocionVigenciaInicio,
                prom.tiempoPVigenciaFin as PromocionVigenciaFin
            FROM PreciosVigentes pv
            LEFT JOIN PromocionesVigentes prom ON 
                prom.ProductoID = pv.ProductoID 
                AND prom.TiendaID = pv.TiendaID
                AND prom.rn = 1
            WHERE pv.rn = 1
            ORDER BY pv.ProductoID, pv.TiendaID;
        `;

        // Construir el array de parámetros dinámicamente
        const queryParams = [mysqlDateTime];
        
        // Agregar tiendaId si existe
        if (tiendaId) {
            queryParams.push(tiendaId);
        }
        
        // Agregar productoId si existe
        if (productoId) {
            queryParams.push(productoId);
        }
        
        // Agregar mysqlDateTime para la segunda parte de la consulta
        queryParams.push(mysqlDateTime);
        
        // Agregar tiendaId y productoId nuevamente si existen
        if (tiendaId) {
            queryParams.push(tiendaId);
        }
        if (productoId) {
            queryParams.push(productoId);
        }

        const [results] = await pool.execute(query, queryParams);

        // Procesar resultados para agrupar promociones por producto y tienda
        const processedResults = results.reduce((acc, row) => {
            const key = `${row.ProductoID}-${row.TiendaID}`;
            
            if (!acc[key]) {
                acc[key] = {
                    productoId: row.ProductoID,
                    nombreProducto: row.NombreProducto,
                    tienda: {
                        tiendaId: row.TiendaID,
                        nombreTienda: row.NombreTienda
                    },
                    precioBase: parseFloat(row.PrecioBase || 0),
                    precioFinal: parseFloat(row.PrecioFinal || row.PrecioBase || 0),
                    vigenciaPrecio: {
                        inicio: row.PrecioVigenciaInicio,
                        fin: row.PrecioVigenciaFin
                    },
                    promociones: []
                };
            }

            // Agregar promoción si existe
            if (row.PromocionID) {
                acc[key].promociones.push({
                    promocionId: row.PromocionID,
                    descuento: parseFloat(row.DescuentoMaximo),
                    vigencia: {
                        inicio: row.PromocionVigenciaInicio,
                        fin: row.PromocionVigenciaFin
                    }
                });
            }

            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: Object.values(processedResults),
            queryDateTime: datetime,
            filters: {
                tiendaId: tiendaId || null,
                productoId: productoId || null
            }
        });

    } catch (error) {
        console.error("Error obteniendo precios y promociones:", error);
        next(error);
    }
};