import { Link, useNavigate } from 'react-router-dom';
import { AvatarCharacter } from './AvatarCharacter';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAccountSidebar } from '../context/AccountSidebarContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function AccountSidebar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { open, closeSidebar } = useAccountSidebar();
  const navigate = useNavigate();
  const { install, canInstall, installed, isIOS, showManualHint, hasNativePrompt } = usePWAInstall();

  if (!open) return null;

  const handleLogout = async () => {
    await logout();
    closeSidebar();
    navigate('/');
  };

  const handleInstall = async () => {
    if (hasNativePrompt) {
      const ok = await install();
      if (ok) closeSidebar();
    } else if (isIOS) {
      alert(t('iosInstallHint'));
    } else {
      alert(t('desktopInstallHint'));
    }
  };

  return (
    <>
      <button type="button" className="sidebar-backdrop" onClick={closeSidebar} aria-label="Close menu" />
      <aside className="account-sidebar" aria-label={t('myAccount')}>
        <div className="sidebar-header">
          <h2>👤 {t('myAccount')}</h2>
          <button type="button" className="sidebar-close" onClick={closeSidebar}>
            ×
          </button>
        </div>

        {user ? (
          <>
            <div className="sidebar-profile">
              <AvatarCharacter gender={user.characterGender} avatar={user.avatar} size={90} />
              <div>
                <strong>{user.username}</strong>
                <p>
                  ⭐ {user.points} · Grade {user.grade}
                </p>
              </div>
            </div>

            <nav className="sidebar-nav">
              <Link to="/profile" className="sidebar-link" onClick={closeSidebar}>
                <span>🏠</span> {t('profile')}
              </Link>
              {!user.isAdmin && (
                <Link to="/statistics" className="sidebar-link" onClick={closeSidebar}>
                  <span>📊</span> {t('statistics')}
                </Link>
              )}
              <Link to="/shop" className="sidebar-link" onClick={closeSidebar}>
                <span>🛍️</span> {t('avatarShop')}
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="sidebar-link" onClick={closeSidebar}>
                  <span>🛡️</span> Admin Panel
                </Link>
              )}
            </nav>

            {!installed && (
              <>
                <button type="button" className="btn btn-gradient sidebar-install" onClick={handleInstall}>
                  📲 {t('installApp')}
                </button>
                {showManualHint && <p className="install-hint-small">{t('installNeedsHttps')}</p>}
              </>
            )}
            {installed && <p className="sidebar-installed">✅ {t('appInstalled')}</p>}

            <button type="button" className="sidebar-logout" onClick={handleLogout}>
              🚪 {t('logout')}
            </button>
          </>
        ) : (
          <div className="sidebar-guest">
            <p>{t('guestMessage')}</p>
            <Link to="/login" className="btn btn-gradient" onClick={closeSidebar}>
              {t('login')}
            </Link>
            <Link to="/register" className="btn btn-secondary sidebar-register" onClick={closeSidebar}>
              {t('signUp')}
            </Link>
            {!installed && (
              <button type="button" className="btn btn-gradient sidebar-install" onClick={handleInstall}>
                📲 {t('installApp')}
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
