import { useNavigate } from 'react-router-dom';

const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  // More people...
]

export const Home = () => {
  const navigate = useNavigate();

  const handlePricingClick = () => {
    navigate('/pricing');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Marketfy</h1>
            <p className="mt-4 text-lg text-gray-700">
              Sistema de gestión de precios y promociones diseñado para administrar y consultar la información de costos de productos en diversas tiendas.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handlePricingClick}
              className="block rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ver Precios y Promociones
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Gestión de Precios</h3>
              <p className="mt-2 text-sm text-gray-500">
                Administra los precios base de productos por tienda, con control de fechas de vigencia para cada precio.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Promociones</h3>
              <p className="mt-2 text-sm text-gray-500">
                Configura y gestiona promociones con descuentos porcentuales, aplicables a productos específicos en tiendas seleccionadas.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Consultas en Tiempo Real</h3>
              <p className="mt-2 text-sm text-gray-500">
                Obtén el precio final de productos considerando precios base y promociones activas en cualquier momento.
              </p>
            </div>
          </div>
        </div>

        {/* Características Principales */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Características Principales</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    <span className="font-medium">Control de Vigencia:</span> Gestiona fechas de inicio y fin para precios y promociones.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    <span className="font-medium">Filtros Avanzados:</span> Consulta por tienda, producto y fecha específica.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    <span className="font-medium">Mejor Promoción:</span> El sistema automáticamente selecciona la promoción con mayor descuento.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
