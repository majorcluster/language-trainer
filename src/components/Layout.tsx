import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Settings, Home, FileText, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { LanguageSelector } from './LanguageSelector';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/train', label: 'Train', icon: BookOpen },
    { path: '/phrases', label: 'Phrases', icon: FileText },
    { path: '/verbs', label: 'Verbs', icon: Zap },
    { path: '/config', label: 'Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-primary-50 to-primary-100">
      <nav className="bg-white shadow-md w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-3 py-3 sm:py-0 sm:grid-cols-[1fr_auto] sm:items-center sm:h-16 sm:gap-2">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <div className="grid grid-flow-col auto-cols-max items-center gap-2 sm:gap-3">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                <span className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  Language Trainer
                </span>
              </div>
              <LanguageSelector />
            </div>
            
            <div className="grid grid-flow-col auto-cols-max gap-1 justify-self-start sm:justify-self-end">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'inline-flex items-center justify-center px-2 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      {
                        'bg-primary-100 text-primary-700': isActive,
                        'text-gray-600 hover:bg-gray-100': !isActive,
                      }
                    )}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

