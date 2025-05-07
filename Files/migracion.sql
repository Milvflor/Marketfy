-- Script de Datos de Ejemplo
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Promociones_Aplicacion;
TRUNCATE TABLE Precios;
TRUNCATE TABLE Promocion_Definiciones;
TRUNCATE TABLE Productos;
TRUNCATE TABLE Tiendas;

ALTER TABLE Tiendas AUTO_INCREMENT = 1;
ALTER TABLE Productos AUTO_INCREMENT = 100;
ALTER TABLE Promocion_Definiciones AUTO_INCREMENT = 1;
ALTER TABLE Precios AUTO_INCREMENT = 1;
ALTER TABLE Promociones_Aplicacion AUTO_INCREMENT = 2000;

-- -------------------------------
-- TIENDAS
-- -------------------------------
INSERT INTO Tiendas (NombreTienda) VALUES
('Supermercado Central'),
('Tienda de la Esquina'),
('Market Norte'),
('Abarrotes Rápidos'),
('Hiper Descuentos');

-- -------------------------------
-- PRODUCTOS
-- -------------------------------

INSERT INTO Productos (NombreProducto) VALUES
('Leche Entera 1L'),
('Pan Blanco de Molde'),
('Huevos Docena'),
('Jugo de Naranja 1.5L'),
('Café Molido 250g');

-- -------------------------------
-- PROMOCION_DEFINICIONES
-- -------------------------------
INSERT INTO Promocion_Definiciones (PorcentajeDescuento) VALUES
(10.00),
(25.00),
(5.00),
(15.50),
(30.00);


-- -------------------------------
-- PRECIOS
-- (TiendaID, ProductoID, Valor, tiempoVigenciaInicio, tiempoVigenciaFin)
-- -------------------------------

-- Precios para Tienda 1 (Supermercado Central)
INSERT INTO Precios (TiendaID, ProductoID, Valor, tiempoVigenciaInicio, tiempoVigenciaFin) VALUES
-- Leche Entera 1L (ProductoID 101) en Tienda 1
(1, 101, 1.10, '2024-01-01 00:00:00', '2024-06-30 23:59:59'),
(1, 101, 1.15, '2024-07-01 00:00:00', '2024-12-31 23:59:59'),
-- Pan Blanco (ProductoID 102) en Tienda 1
(1, 102, 2.50, '2024-03-01 00:00:00', '2024-08-31 23:59:59'),
-- Huevos (ProductoID 103) en Tienda 1
(1, 103, 3.20, '2024-01-01 00:00:00', '2025-12-31 23:59:59');

-- Precios para Tienda 2 (Tienda de la Esquina)
INSERT INTO Precios (TiendaID, ProductoID, Valor, tiempoVigenciaInicio, tiempoVigenciaFin) VALUES
-- Leche Entera 1L (ProductoID 101) en Tienda 2
(2, 101, 1.12, '2024-02-01 00:00:00', '2024-07-31 23:59:59'),
-- Café Molido (ProductoID 105) en Tienda 2
(2, 105, 4.50, '2024-01-01 00:00:00', '2024-12-31 23:59:59');

-- Precios para Tienda 3 (Market Norte)
INSERT INTO Precios (TiendaID, ProductoID, Valor, tiempoVigenciaInicio, tiempoVigenciaFin) VALUES
-- Leche Entera 1L (ProductoID 101) en Tienda 3
(3, 101, 1.08, '2024-01-15 00:00:00', '2024-05-31 23:59:59'),
(3, 101, 1.13, '2024-06-01 00:00:00', '2024-09-30 23:59:59');


-- -------------------------------
-- PROMOCIONES_APLICACION
-- (TiendaID, ProductoID, PromocionID (numérico), tiempoPVigenciaInicio, tiempoPVigenciaFin)
-- -------------------------------

-- Promociones para Tienda 1 (Supermercado Central)
-- Aplicar PromoID 1 (10%) a Leche (101) en Tienda 1 durante Mayo
INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin) VALUES
(1, 101, 1, '2024-05-01 00:00:00', '2024-05-31 23:59:59');

-- Aplicar PromoID 2 (25%) a Leche (101) en Tienda 1 durante la primera quincena de Mayo (se solapa con la anterior)
INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin) VALUES
(1, 101, 2, '2024-05-01 00:00:00', '2024-05-15 23:59:59'); -- Se aplicará esta (25%) por ser mejor

-- Aplicar PromoID 4 (15.5%) a Pan (102) en Tienda 1 durante Julio
INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin) VALUES
(1, 102, 4, '2024-07-01 00:00:00', '2024-07-31 23:59:59');

-- Promociones para Tienda 2 (Tienda de la Esquina)
-- Aplicar PromoID 3 (5%) a Café (105) en Tienda 2 durante todo el año
INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin) VALUES
(2, 105, 3, '2024-01-01 00:00:00', '2024-12-31 23:59:59');

-- Aplicar PromoID 5 (30%) a Leche (101) en Tienda 2 durante Junio (se solapa con el precio base de leche)
INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin) VALUES
(2, 101, 5, '2024-06-01 00:00:00', '2024-06-30 23:59:59');


-- Promociones para Tienda 3 (Market Norte)
-- Aplicar PromoID 1 (10%) a Leche (101) en Tienda 3 durante la segunda quincena de Mayo
INSERT INTO Promociones_Aplicacion (TiendaID, ProductoID, PromocionID, tiempoPVigenciaInicio, tiempoPVigenciaFin) VALUES
(3, 101, 1, '2024-05-16 00:00:00', '2024-05-31 23:59:59');


-- Verificación de datos (opcional)
SELECT * FROM Tiendas;
SELECT * FROM Productos;
SELECT * FROM Promocion_Definiciones;
SELECT * FROM Precios ORDER BY TiendaID, ProductoID, tiempoVigenciaInicio;
SELECT * FROM Promociones_Aplicacion ORDER BY TiendaID, ProductoID, tiempoPVigenciaInicio;