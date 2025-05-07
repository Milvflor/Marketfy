import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const PricingTable = () => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedPromotions, setSelectedPromotions] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tienda/stores`);
            if (response.data && Array.isArray(response.data.data)) {
                setStores(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching stores:', err);
        }
    };

    const fetchProductList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/productos/products`);
            if (response.data && Array.isArray(response.data.data)) {
                setProductList(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const fetchProducts = async (date) => {
        try {
            setLoading(true);
            const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
            let url = `${import.meta.env.VITE_API_URL}/api/v1/market/getFinalPriceProducts?datetime=${formattedDate}`;
            
            if (selectedStore) {
                url += `&tiendaId=${selectedStore}`;
            }
            if (selectedProduct) {
                url += `&productoId=${selectedProduct}`;
            }

            const response = await axios.get(url);
            
            if (response.data && Array.isArray(response.data.data)) {
                setProducts(response.data.data);
                setError(null);
            } else {
                console.error('Respuesta inesperada de la API:', response.data);
                setError('Formato de datos inválido en la respuesta del servidor');
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || 'Error al cargar los precios. Por favor, intente nuevamente.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
        fetchProductList();
    }, []);

    useEffect(() => {
        fetchProducts(selectedDate);
    }, [selectedDate, selectedStore, selectedProduct]);

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setSelectedDate(newDate);
    };

    const handleStoreChange = (e) => {
        setSelectedStore(e.target.value);
    };

    const handleProductChange = (e) => {
        setSelectedProduct(e.target.value);
    };

    const handleViewPromotions = (promotions) => {
        setSelectedPromotions(promotions);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPromotions(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Consulta de Precios y Promociones</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="datePicker" className="font-medium">
                            Fecha:
                        </label>
                        <input
                            type="datetime-local"
                            id="datePicker"
                            value={format(selectedDate, "yyyy-MM-dd'T'HH:mm")}
                            onChange={handleDateChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="storeSelect" className="font-medium">
                            Tienda:
                        </label>
                        <select
                            id="storeSelect"
                            value={selectedStore}
                            onChange={handleStoreChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas las tiendas</option>
                            {stores.map((store) => (
                                <option key={store.tiendaId} value={store.tiendaId}>
                                    {store.nombreTienda}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="productSelect" className="font-medium">
                            Producto:
                        </label>
                        <select
                            id="productSelect"
                            value={selectedProduct}
                            onChange={handleProductChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los productos</option>
                            {productList.map((product) => (
                                <option key={product.productoId} value={product.productoId}>
                                    {product.nombreProducto}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {(!Array.isArray(products) || products.length === 0) ? (
                <div className="text-center text-gray-500 py-8">
                    No hay productos disponibles para los filtros seleccionados
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tienda
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio Base
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio Final
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Promociones
                                </th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={`${product.productoId}-${product.tienda?.tiendaId}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{product.nombreProducto}</div>
                                        <div className="text-sm text-gray-500">{product.descripcion}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product.tienda?.nombreTienda || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${(product.precioBase || 0).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-green-600">
                                            ${(product.precioFinal || product.precioBase || 0).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {Array.isArray(product.promociones) && product.promociones.length > 0 ? (
                                            <div className="space-y-1">
                                                {product.promociones.map((promo) => (
                                                    <div key={promo.promocionId} className="text-sm">
                                                        <span className="font-medium text-blue-600">{promo.nombre}</span>
                                                        <span className="text-gray-500"> - {promo.descuento}% de descuento</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">Sin promociones</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {Array.isArray(product.promociones) && product.promociones.length > 0 && (
                                            <button
                                                onClick={() => handleViewPromotions(product.promociones)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Ver Detalles
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Detalles de Promociones */}
            {isModalOpen && selectedPromotions && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Detalles de Promociones</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Cerrar</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {selectedPromotions.map((promo) => (
                                <div key={promo.promocionId} className="border rounded-lg p-4">
                                    <h4 className="text-lg font-medium text-blue-600 mb-2">{promo.nombre}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Descuento</p>
                                            <p className="text-lg font-medium text-green-600">{promo.descuento}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Vigencia</p>
                                            <p className="text-sm">
                                                {format(parseISO(promo.vigencia.inicio), 'dd/MM/yyyy HH:mm', { locale: es })} - 
                                                {format(parseISO(promo.vigencia.fin), 'dd/MM/yyyy HH:mm', { locale: es })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingTable; 