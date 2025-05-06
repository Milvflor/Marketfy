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
    VersionPrecio VARCHAR(10) NOT NULL,
    Valor DECIMAL(10, 2) NOT NULL,
    tiempoVigenciaInicio DATETIME NOT NULL,
    tiempoVigenciaFin DATETIME NOT NULL,

    -- Claves Foráneas
    CONSTRAINT fk_precio_tienda FOREIGN KEY (TiendaID) REFERENCES Tiendas(TiendaID) ON DELETE RESTRICT,
    CONSTRAINT fk_precio_producto FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID) ON DELETE RESTRICT,

    -- Restricciones de Negocio
    CONSTRAINT chk_precio_positivo CHECK (Valor >= 0),
    CONSTRAINT chk_precio_fechas_validas CHECK (tiempoVigenciaFin > tiempoVigenciaInicio)

    /*
    -- IMPORTANTE: Restricción de No Solapamiento (REQ 2.e)
    -- MySQL no tiene un constraint directo tipo EXCLUDE.
    -- Se debe implementar mediante:
    -- 1. Lógica en la capa de aplicación ANTES de insertar/actualizar.
    -- 2. Triggers (BEFORE INSERT, BEFORE UPDATE) que verifiquen si existe
    --    otro registro para el mismo TiendaID y ProductoID cuyo rango de fechas
    --    se solape con el nuevo rango. Si existe, cancelar la operación.
    -- Ejemplo de consulta a usar dentro del trigger/app:
    -- SELECT 1 FROM Precios
    -- WHERE TiendaID = NEW.TiendaID AND ProductoID = NEW.ProductoID AND PrecioRegistroID != NEW.PrecioRegistroID -- (En caso de UPDATE)
    -- AND NEW.tiempoVigenciaInicio < tiempoVigenciaFin AND NEW.tiempoVigenciaFin > tiempoVigenciaInicio;
    */
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