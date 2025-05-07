import pool from '../config/db.js';

export const createProduct = async (req, res, next) => {
    const { nombreProducto } = req.body;

    // Validación básica
    if (!nombreProducto || typeof nombreProducto !== 'string' || nombreProducto.trim() === '') {
        return res.status(400).json({ message: 'El campo "nombreProducto" es requerido y no puede estar vacío.' });
    }

    try {

        const nombreProductoTrim = nombreProducto.trim();
        const existNameQuery = 'SELECT ProductoID FROM Productos WHERE NombreProducto = ? LIMIT 1;';
        const [existingProducts] = await pool.execute(existNameQuery, [nombreProductoTrim]);
        if (existingProducts.length > 0) {
            return res.status(409).json({
                message: `El nombre del producto '${nombreProductoTrim}' ya existe.`,
                existingProductoId: existingProducts[0].ProductoID
            });
        }

        const insertQuery = 'INSERT INTO Productos (NombreProducto) VALUES (?);';
        const [result] = await pool.execute(insertQuery, [nombreProducto.trim()]);

        res.status(201).json({
            message: 'Producto creado exitosamente.',
            productoId: result.insertId, // ID numérico autoincremental generado
            nombreProducto: nombreProducto.trim()
        });
    } catch (error) {
        console.error("Error creando producto:", error);
        // Podrías chequear errores específicos si NombreProducto fuera UNIQUE
        next(error);
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const query = "SELECT ProductoID as productoId, NombreProducto as nombreProducto FROM Productos ORDER BY NombreProducto;";
        const [products] = await pool.execute(query);

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        next(error);
    }
};