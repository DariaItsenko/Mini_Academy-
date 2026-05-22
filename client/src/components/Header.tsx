import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header({ variant = 'home' }: { variant?: 'home' | 'minimal' }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (variant === 'minimal') {
    return (
      <header className="top-nav minimal-nav">
        <LanguageSwitcher />
      </header>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="top-nav home-nav">
      <LanguageSwitcher />
      <div className="nav-actions">
        {user ? (
          <>
            {!user.isAdmin && (
              <Link to="/statistics" className="nav-btn nav-stats">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7 3h4v11h-4V10z"
                    fill="currentColor"
                  />
                </svg>
                {t('statistics')}
              </Link>
            )}
            {!user.isAdmin && (
              <Link to="/profile" className="nav-btn nav-profile">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"
                    fill="currentColor"
                  />
                </svg>
                {user.username}
              </Link>
            )}
            {user.isAdmin && (
              <span className="admin-header-badge">🛡️ {user.username}</span>
            )}
            <button type="button" className="nav-btn logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M10 17v-2h8v-6h-8V7l-5 5 5 5zm9-13H3v2h16V4z"
                  fill="currentColor"
                />
              </svg>
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn nav-stats">
              {t('login')}
            </Link>
            <Link to="/register" className="nav-btn nav-profile">
              {t('signUp')}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
