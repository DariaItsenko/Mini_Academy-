import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAccountSidebar } from '../context/AccountSidebarContext';

interface Props {
  onClose: () => void;
}

export function WelcomeModal({ onClose }: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { openSidebar } = useAccountSidebar();

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-modal card yellow-border">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="welcome-modal-icon">🎓</div>
        <h2 id="welcome-title">{t('welcomeTitle')}</h2>
        <p className="welcome-modal-sub">{t('welcomeSub')}</p>

        <div className="welcome-modal-actions">
          <button
            type="button"
            className="welcome-action-btn login"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
          >
            <span>🔑</span>
            <span>{t('login')}</span>
          </button>
          <button
            type="button"
            className="welcome-action-btn register"
            onClick={() => {
              onClose();
              navigate('/register');
            }}
          >
            <span>✨</span>
            <span>{t('signUp')}</span>
          </button>
          <button
            type="button"
            className="welcome-action-btn account"
            onClick={() => {
              onClose();
              openSidebar();
            }}
          >
            <span>👤</span>
            <span>{t('myAccount')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
