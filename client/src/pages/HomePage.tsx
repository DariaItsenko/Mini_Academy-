import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { WelcomeModal } from '../components/WelcomeModal';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const seen = sessionStorage.getItem('welcome-shown');
      if (!seen) {
        setShowWelcome(true);
        sessionStorage.setItem('welcome-shown', '1');
      }
    }
  }, [loading, user]);

  return (
    <div className="page home-page">
      <div className="decor decor-bear">🐻</div>
      <div className="decor decor-fox">🦊</div>
      <div className="decor decor-rabbit">🐰</div>
      <div className="decor decor-star">⭐</div>
      <div className="decor decor-flower">🌺</div>
      <div className="decor decor-palette">🎨</div>

      <Header variant="home" />
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      <main className="home-main">
        <h1 className="home-title">
          <span className="title-deco" aria-hidden>
            🎓
          </span>
          <span className="title-text">{t('title')}</span>
          <span className="title-deco" aria-hidden>
            📚
          </span>
        </h1>
        <p className="home-subtitle">{t('subtitle')}</p>

        <div className="subject-grid">
          <div className="subject-wrap">
            <span className="subject-float">🔢</span>
            <Link to={user ? '/subject/math' : '/login'} className="subject-card math-card">
              <span className="subject-icon" aria-hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="2" width="16" height="20" rx="2" stroke="white" strokeWidth="2" />
                  <path d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3" stroke="white" strokeWidth="2" />
                </svg>
              </span>
              <span className="subject-label">{t('math')}</span>
            </Link>
          </div>
          <div className="subject-wrap">
            <span className="subject-float">📖</span>
            <Link to={user ? '/subject/english' : '/login'} className="subject-card english-card">
              <span className="subject-icon" aria-hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 4h9a3 3 0 0 1 3 3v13l-4-2-4 2V4z"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M6 4v13l4-2 4 2V7a3 3 0 0 0-3-3H6z" stroke="white" strokeWidth="2" />
                </svg>
              </span>
              <span className="subject-label">{t('english')}</span>
            </Link>
          </div>
          <div className="subject-wrap">
            <span className="subject-float ua-float">UA</span>
            <Link to={user ? '/subject/ukrainian' : '/login'} className="subject-card ukrainian-card">
              <span className="subject-icon" aria-hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                  <path
                    d="M3 12h18M12 3c3 3 4.5 6 4.5 9S15 18 12 21M12 3c-3 3-4.5 6-4.5 9S9 18 12 21"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <span className="subject-label">{t('ukrainian')}</span>
            </Link>
          </div>
        </div>

        {!user && (
          <button type="button" className="show-welcome-link" onClick={() => setShowWelcome(true)}>
            {t('welcomeTitle')} — {t('login')} / {t('signUp')}
          </button>
        )}
        <p className="home-footer">
          Perfect for elementary grades • Interactive learning • Expert instructors
        </p>
      </main>
    </div>
  );
}
