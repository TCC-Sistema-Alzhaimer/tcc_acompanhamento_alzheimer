export default function HydrateFallbackComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Spinner animado */}
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Carregando...
        </h2>
        <p className="text-gray-600">Preparando sua experiência</p>
      </div>
    </div>
  );
}
