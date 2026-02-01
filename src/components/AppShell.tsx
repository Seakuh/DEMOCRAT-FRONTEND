import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Info } from 'lucide-react';
import { getCurrentUser } from '../mock/user';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Direkte Demokratie
                </h1>
                <p className="text-xs text-gray-600">Abstimmung über Gesetzesänderungen</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Abstimmungen
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                Info
              </Link>
              <div className="pl-4 border-l border-gray-300">
                <div className="text-xs text-gray-600">
                  {user.displayName}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo & Beschreibung */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Vote className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Direkte Demokratie</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Eine Plattform für transparente Bürgerbeteiligung und demokratische Abstimmungen über Gesetzesänderungen.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm hover:text-white transition-colors">
                    Abstimmungen
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm hover:text-white transition-colors">
                    Über uns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Rechtliches */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Rechtliches</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/impressum" className="text-sm hover:text-white transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-sm hover:text-white transition-colors">
                    Datenschutzerklärung
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Direkte Demokratie. Alle Rechte vorbehalten.
              </p>
              <p className="text-xs text-gray-600">
                MVP Demo – Nicht für den produktiven Einsatz
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
