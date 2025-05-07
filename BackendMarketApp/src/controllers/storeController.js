import pool from "../config/db.js";

export const createStore = async (req, res, next) => {
  const { nombreTienda } = req.body;

  if (
    !nombreTienda ||
    typeof nombreTienda !== "string" ||
    nombreTienda.trim() === ""
  ) {
    return res
      .status(400)
      .json({
        message: 'El campo "nombreTienda" es requerido y no puede estar vacío.',
      });
  }

  try {
    // Consultar si el nombre ya no existe
    const nombreTiendaTrim = nombreTienda.trim();
    const existNameQuery = 'SELECT TiendaID FROM Tiendas WHERE NombreTienda = ? LIMIT 1;';
    const [existingStores] = await pool.execute(existNameQuery, [nombreTiendaTrim]);
    if (existingStores.length > 0) {
        return res.status(409).json({
            message: `El nombre de tienda '${nombreTiendaTrim}' ya existe.`,
            existingTiendaId: existingStores[0].TiendaID
        });
    }

    const insertQuery = "INSERT INTO Tiendas (NombreTienda) VALUES (?);";
    const [result] = await pool.execute(insertQuery, [nombreTienda.trim()]);

    res.status(201).json({
      message: "Tienda creada exitosamente.",
      tiendaId: result.insertId,
      nombreTienda: nombreTienda.trim(),
    });
  } catch (error) {
    console.error("Error creando tienda:", error);
    next(error);
  }
};

export const getStores = async (req, res, next) => {
    try {
        const query = "SELECT TiendaID as tiendaId, NombreTienda as nombreTienda FROM Tiendas ORDER BY NombreTienda;";
        const [stores] = await pool.execute(query);

        res.json({
            success: true,
            data: stores
        });
    } catch (error) {
        console.error("Error obteniendo tiendas:", error);
        next(error);
    }
};