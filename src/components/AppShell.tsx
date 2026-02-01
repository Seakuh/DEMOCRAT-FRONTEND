import { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Info, Menu, X, User } from 'lucide-react';
import { getCurrentUser } from '../mock/user';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const user = getCurrentUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`glass-header ${isScrolled ? 'glass-header-scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                <Vote className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base md:text-xl font-black text-white leading-none tracking-tight">
                  DEMOCRAT
                </h1>
                <p className="hidden sm:block text-[10px] md:text-xs text-white/80 font-medium">Direkte Demokratie</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm font-bold text-white hover:text-white/80 transition-colors"
              >
                Abstimmungen
              </Link>
              <Link
                to="/about"
                className="text-sm font-bold text-white hover:text-white/80 transition-colors flex items-center gap-1.5"
              >
                <Info className="w-4 h-4" />
                Info
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-white/20">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-white">{user.displayName}</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Bürger</span>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <User className="w-4 h-4 text-white/60" />
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary border-b border-white/10 animate-in slide-in-from-top duration-200">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-bold text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <Vote className="w-5 h-5 text-white" />
                Abstimmungen
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-bold text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <Info className="w-5 h-5 text-white" />
                Info
              </Link>
              <div className="mt-4 pt-4 border-t border-white/10 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <User className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{user.displayName}</span>
                    <span className="text-xs text-white/70 uppercase tracking-widest font-bold">Bürger</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                Early Stage
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
