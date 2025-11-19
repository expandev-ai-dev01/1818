import { Outlet, Link, useLocation } from 'react-router-dom';

export const RootLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              GradeBox
            </Link>
            <nav className="flex gap-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/grades"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/grades')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Notas
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">
            © 2024 GradeBox - Sistema de Gerenciamento de Notas
          </p>
        </div>
      </footer>
    </div>
  );
};
