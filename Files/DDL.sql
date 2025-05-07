
-- Usar InnoDB para soporte de Claves Foráneas
SET default_storage_engine=InnoDB;

-- Tabla para Tiendas
CREATE TABLE Tiendas (
    TiendaID INT AUTO_INCREMENT PRIMARY KEY,
    NombreTienda VARCHAR(100) NOT NULL
);

-- Tabla para Productos
CREATE TABLE Productos (
    ProductoID INT AUTO_INCREMENT PRIMARY KEY,
    NombreProducto VARCHAR(150) NOT NULL
);
ALTER TABLE Productos AUTO_INCREMENT = 100;

-- Tabla para Definición de Promociones
CREATE TABLE Promocion_Definiciones (
    PromocionID INT AUTO_INCREMENT PRIMARY KEY,
    PorcentajeDescuento DECIMAL(5, 2) NOT NULL
    CHECK (PorcentajeDescuento >= 0 AND PorcentajeDescuento <= 100)
);

-- Tabla para Precios
CREATE TABLE Precios (
    PrecioRegistroID INT AUTO_INCREMENT PRIMARY KEY, -- PK Sustituta
    TiendaID INT NOT NULL,
    ProductoID INT NOT NULL,
    Valor DECIMAL(10, 2) NOT NULL,
    tiempoVigenciaInicio DATETIME NOT NULL,
    tiempoVigenciaFin DATETIME NOT NULL,

    -- Claves Foráneas
    CONSTRAINT fk_precio_tienda FOREIGN KEY (TiendaID) REFERENCES Tiendas(TiendaID) ON DELETE RESTRICT,
    CONSTRAINT fk_precio_producto FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID) ON DELETE RESTRICT,

    -- Restricciones de Negocio
    CONSTRAINT chk_precio_positivo CHECK (Valor >= 0),
    CONSTRAINT chk_precio_fechas_validas CHECK (tiempoVigenciaFin > tiempoVigenciaInicio)
);

-- Índice para búsquedas de precios
CREATE INDEX idx_precios_tienda_producto_fecha ON Precios (TiendaID, ProductoID, tiempoVigenciaInicio, tiempoVigenciaFin);


-- Tabla para Aplicación de Promociones
CREATE TABLE Promociones_Aplicacion (
    AplicacionID INT AUTO_INCREMENT PRIMARY KEY, -- PK Sustituta
    TiendaID INT NOT NULL,
    ProductoID INT NOT NULL,
    PromocionID INT NOT NULL, -- FK
    tiempoPVigenciaInicio DATETIME NOT NULL,
    tiempoPVigenciaFin DATETIME NOT NULL,

    -- Claves Foráneas
    CONSTRAINT fk_promoapp_tienda FOREIGN KEY (TiendaID) REFERENCES Tiendas(TiendaID) ON DELETE RESTRICT,
    CONSTRAINT fk_promoapp_producto FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID) ON DELETE RESTRICT,
    CONSTRAINT fk_promoapp_definicion FOREIGN KEY (PromocionID) REFERENCES Promocion_Definiciones(PromocionID) ON DELETE RESTRICT,

    -- Restricción de Negocio (Ignorada en MySQL < 8.0.16)
    CONSTRAINT chk_promoapp_fechas_validas CHECK (tiempoPVigenciaFin > tiempoPVigenciaInicio)

    -- No se requiere restricción de no solapamiento aquí (REQ 3.d permite solapamiento)
);

-- Índice para búsquedas de promociones aplicadas
CREATE INDEX idx_promoapp_tienda_producto_fecha ON Promociones_Aplicacion (TiendaID, ProductoID, tiempoPVigenciaInicio, tiempoPVigenciaFin);