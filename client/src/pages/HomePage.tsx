import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { WelcomeModal } from '../components/WelcomeModal';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { getSubjectCardClass, getSubjectTitle } from '../lib/subjectDisplay';

export default function HomePage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { curriculum, loading: curriculumLoading } = useCurriculum();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      const seen = sessionStorage.getItem('welcome-shown');
      if (!seen) {
        setShowWelcome(true);
        sessionStorage.setItem('welcome-shown', '1');
      }
    }
  }, [authLoading, user]);

  const subjects = Object.values(curriculum);

  return (
    <div className="page home-page">
      <div className="decor decor-bear">🐻</div>
      <div className="decor decor-fox">🦊</div>
      <div className="decor decor-rabbit">🐰</div>
      <div className="decor decor-star">⭐</div>
      <div className="decor decor-flower">🌺</div>
      <div className="decor decor-palette">🎨</div>

      <Header variant="home" />
      {user?.isAdmin && <p className="admin-home-hint">{t('adminPreviewHint')}</p>}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      <main className="home-main">
        <h1 className="home-title">
          <span className="title-text">{t('title')}</span>
        </h1>
        <p className="home-subtitle">{t('subtitle')}</p>

        {curriculumLoading ? (
          <p className="home-loading-subjects">{t('loading')}...</p>
        ) : (
          <div className={`subject-grid subject-grid-dynamic count-${subjects.length}`}>
            {subjects.map((subj) => (
              <div key={subj.id} className="subject-wrap">
                <span className="subject-float">{subj.icon}</span>
                <Link
                  to={user ? `/subject/${subj.id}` : '/login'}
                  className={`subject-card ${getSubjectCardClass(subj)}`}
                >
                  <span className="subject-icon subject-emoji-icon" aria-hidden>
                    {subj.icon}
                  </span>
                  <span className="subject-label">{getSubjectTitle(subj, t)}</span>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <button type="button" className="show-welcome-link" onClick={() => setShowWelcome(true)}>
            {t('welcomeTitle')} — {t('login')} / {t('signUp')}
          </button>
        )}
        <p className="home-footer">{t('homeFooter')}</p>
      </main>
    </div>
  );
}
