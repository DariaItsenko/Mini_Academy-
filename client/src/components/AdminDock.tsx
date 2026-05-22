import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export function AdminDock() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { pathname } = useLocation();

  if (!user?.isAdmin) return null;

  const isHome = pathname === '/';
  const isAccount =
    pathname === '/profile' || pathname === '/shop' || pathname.startsWith('/shop');
  const isAdmin = pathname.startsWith('/admin');

  return (
    <nav className="admin-dock" aria-label="Admin navigation">
      <Link to="/" className={`admin-dock-btn home ${isHome ? 'active' : ''}`}>
        <span className="dock-icon" aria-hidden>
          🏠
        </span>
        <span>{t('dockHome')}</span>
      </Link>
      <Link to="/profile" className={`admin-dock-btn account ${isAccount ? 'active' : ''}`}>
        <span className="dock-icon" aria-hidden>
          👤
        </span>
        <span>{t('dockAccount')}</span>
      </Link>
      <Link to="/admin" className={`admin-dock-btn panel ${isAdmin ? 'active' : ''}`}>
        <span className="dock-icon" aria-hidden>
          🛡️
        </span>
        <span>{t('adminPanel')}</span>
      </Link>
    </nav>
  );
}
