# Marketfy!
Es un sistema de gestión de precios y promociones diseñado para administrar y consultar la información de costos de productos en diversas tiendas.

**Home Page**
<img width="1111" alt="Screenshot 2025-05-06 at 10 10 03 PM" src="https://github.com/user-attachments/assets/ac008104-d15b-40ed-835e-a03b3a0149f2" />

**Consultas**
<img width="1172" alt="Screenshot 2025-05-06 at 10 09 46 PM" src="https://github.com/user-attachments/assets/98cb9ece-f955-43a3-9a21-2a0067a9e439" />

**Vigencia de Promociones**

<img width="815" alt="Screenshot 2025-05-06 at 10 09 51 PM" src="https://github.com/user-attachments/assets/e117bce2-27d9-47c8-ad33-485a551d21bb" />

## Ejecución
<a name='ejecucion'></a>
1. Clone el repositorio en su computadora local.
2. Descomprima el archivo `Proyecto.zip`.
3. Desde el terminal, ingrese a la carpeta **Proyecto**  y ejecute `cd Proyecto/`.
   ```
   Estructura de repositorio (luego de descomprimir)
   .
    ├── Proyecto
    │   ├── app-back
    │   │   ├── Dockerfile
    │   │   ├── index.js
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   └── src
    │   │       ├── config
    │   │       │   └── db.js
    │   │       ├── controllers
    │   │       │   ├── consultasController.js
    │   │       │   ├── priceController.js
    │   │       │   ├── productController.js
    │   │       │   ├── promotionController.js
    │   │       │   └── storeController.js
    │   │       ├── docs
    │   │       │   └── swagger.yaml
    │   │       ├── models
    │   │       │   └── Event.js
    │   │       └── routes
    │   │           ├── consultasRoutes.js
    │   │           ├── eventRoutes.js
    │   │           ├── priceRoutes.js
    │   │           ├── productRoutes.js
    │   │           ├── promotionRoutes.js
    │   │           └── storeRoutes.js
    │   ├── app-front
    │   │   ├── Dockerfile
    │   │   ├── README.md
    │   │   ├── index.html
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── public
    │   │   │   ├── logo-with-shadow.png
    │   │   │   └── vite.svg
    │   │   ├── src
    │   │   │   ├── App.jsx
    │   │   │   ├── assets
    │   │   │   │   └── react.svg
    │   │   │   ├── components
    │   │   │   │   ├── ErrorFallback.jsx
    │   │   │   │   ├── Loading.jsx
    │   │   │   │   └── PricingTable.jsx
    │   │   │   ├── general
    │   │   │   │   ├── Layout.jsx
    │   │   │   │   ├── NotFound.jsx
    │   │   │   │   ├── RoutePaths.jsx
    │   │   │   │   └── Router.jsx
    │   │   │   ├── home
    │   │   │   │   └── Home.jsx
    │   │   │   ├── index.css
    │   │   │   └── main.jsx
    │   │   └── vite.config.js
    │   ├── docker-compose.yml
    │   └── init.sql
    ├── Proyecto.zip
    ├── README.md
    └── documents
        ├── Precios y Promociones API.postman_collection.json
        └── normalizaciones.xlsx
   ```
   
4. Dentro de la carpeta `Proyecto`, ejecute `docker-compose up --build -d` para construir y levantar los contenedores de la aplicación.

#### Caso de Exito
  <img width="568" alt="Screenshot 2025-05-07 at 1 05 30 AM" src="https://github.com/user-attachments/assets/24ae0284-6751-4229-9418-4067c6aa98d5" />

#### Caso de Error levantando los contenedores o instalando dependencias
  <img width="886" alt="Screenshot 2025-05-07 at 1 06 58 AM" src="https://github.com/user-attachments/assets/81542894-864d-4505-aac4-db2e4ae25403" />

> Si encuentra errores, ejecute `docker-compose down -v` para desmontar completamente los contenedores y volúmenes. Luego, vuelva a ejecutar el *paso 2* de esta sección.
5. Con el docker arriba, diríjase al [HomePage](http://localhost:3000).

## Desarrollo (Entregables)
### 1. Modelo de datos:
#### a. Ilustración del Modelo Entidad Relación normalizado hasta el tipo 3NF.
**Tablas No Normalizadas**
<img width="774" alt="Screenshot 2025-05-06 at 8 22 00 PM" src="https://github.com/user-attachments/assets/897cdc7c-2631-4b23-a35a-127a1eabf429" />
**Tablas Normalizadas en su Primera Forma Normal**
Identificando claves primarias y atomizando valores.
<img width="763" alt="Screenshot 2025-05-06 at 8 22 07 PM" src="https://github.com/user-attachments/assets/da6b004f-17bd-4263-8222-5dc06c61e767" />
**Tablas Normalizadas en su Segunda Forma Normal**
Identificación de campos que no dependen únicamente de su clave primaria y eliminación de dependencias parciales.
<img width="1146" alt="Screenshot 2025-05-06 at 8 22 18 PM" src="https://github.com/user-attachments/assets/839b905b-38ee-4323-b2c5-2277341f0869" />
**Tablas Normalizadas en su Tercera Forma Normal** (Diagrama generado con [DataGrip](https://www.jetbrains.com/es-es/datagrip/))
Generación de nuevas claves primarias (si es necesario) y depuración de dependencias transitivas.
<img width="866" alt="Screenshot 2025-05-06 at 8 19 24 PM" src="https://github.com/user-attachments/assets/664f24d6-12da-4df6-9f1f-0995635d032f" />

#### b. Archivo con las sentencias DDL y datos de ejemplo (MySQL).
El archivo ./Proyecto/init.sql contiene el DDL y los datos de ejemplo.
Este script se ejecuta automáticamente al inicializar el contenedor de Docker de la base de datos.

### 2. Colección de Postman 
[Visualizar/Descargar colección](./documents/Precios%20y%20Promociones%20API.postman_collection.json)
#### a. Crear una versión de precio para un producto en una tienda.
<img width="1065" alt="Screenshot 2025-05-07 at 12 40 22 AM" src="https://github.com/user-attachments/assets/28fdef5c-cfa8-4049-9934-b7c0d0a78f3c" />

#### b. Crear una promoción.
<img width="1065" alt="Screenshot 2025-05-07 at 12 51 29 AM" src="https://github.com/user-attachments/assets/acf54fe7-365f-435d-a546-923fbcbcbb48" />

#### c. Asociar una promoción a un producto y tienda.

**Precios: Primera promoción al producto**
<img width="856" alt="Screenshot 2025-05-07 at 12 53 23 AM" src="https://github.com/user-attachments/assets/d0ee1bfb-e5c8-40bf-9061-171891f0bac3" />

**Promociones: Permite solapamiento**
<img width="823" alt="Screenshot 2025-05-07 at 12 54 03 AM" src="https://github.com/user-attachments/assets/9ade99f5-65f4-466b-ac88-f2f5b830d129" />

#### d. Obtener el precio final de un producto en una tienda.
**Consultando precio de producto con una promoción**
<img width="846" alt="Screenshot 2025-05-07 at 12 56 25 AM" src="https://github.com/user-attachments/assets/ff6213e6-4a92-49c2-aef0-8baae5b314f4" />

**Consultando precio de producto con dos promociones solapadas por periodo (se elige la de mayor porcentaje)**
<img width="841" alt="Screenshot 2025-05-07 at 12 57 55 AM" src="https://github.com/user-attachments/assets/2be28abc-fa11-4ba7-9394-cdd31a06370a" />

### 3. Documentación de API con Swagger
La documentación de la API está disponible en [API Marketfy Swagger](http://localhost:4000/api-docs/#/Consultas/getFinalPrice) (o el puerto configurado para el backend) una vez que los contenedores de Docker estén en ejecución.
<img width="1201" alt="Screenshot 2025-05-07 at 1 00 27 AM" src="https://github.com/user-attachments/assets/a3619f39-1260-482a-aea1-6ff55fa01265" />
<img width="1254" alt="Screenshot 2025-05-07 at 1 27 54 AM" src="https://github.com/user-attachments/assets/6ae69862-1ee1-4699-8f0c-11b6c876fbb5" />


Desarrolladora: Milca Valdez
