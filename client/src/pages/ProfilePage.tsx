import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api';
import type { Achievement } from '../types';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    api.getAchievements().then((r) => setAchievements(r.achievements)).catch(() => {});
  }, [user]);

  if (!user) return null;

  return (
    <div className="page profile-page">
      <Link to="/" className="back-btn">
        <span aria-hidden>←</span> {t('backHome')}
      </Link>

      <div className="card profile-card purple-border">
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-ring">
              <div className="avatar-emoji" aria-hidden>
                😊
              </div>
              <button type="button" className="avatar-camera" aria-label="Change avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 4h2l1-2h2l1 2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4zm3 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <div className="stats-badges">
              <div className="stat-pill points">
                <span className="pill-icon" aria-hidden>
                  ⭐
                </span>
                <span className="pill-text">
                  <span className="pill-label">{t('points')}</span>
                  <span className="pill-value">{user.points}</span>
                </span>
              </div>
              <div className="stat-pill streak">
                <span className="pill-icon" aria-hidden>
                  📅
                </span>
                <span className="pill-text">
                  <span className="pill-label">{t('streak')}</span>
                  <span className="pill-value">
                    {user.streak} 🔥
                  </span>
                </span>
              </div>
              <div className="stat-pill grade">
                <span className="pill-icon" aria-hidden>
                  🎀
                </span>
                <span className="pill-text">
                  <span className="pill-label">{t('grade')}</span>
                  <span className="pill-value">
                    {user.grade}/12
                  </span>
                </span>
              </div>
            </div>
            <Link to="/shop" className="btn btn-shop">
              <span aria-hidden>🛍️</span> {t('avatarShop')}
              <span className="shop-cards" aria-hidden>
                🃏
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="card achievements-card yellow-border">
        <h2>
          <span className="ach-title-icon" aria-hidden>
            🏅
          </span>
          {t('achievements')}
        </h2>
        <div className="achievements-grid">
          {achievements.map((a) => (
            <div key={a.id} className={`achievement ${a.unlocked ? 'unlocked' : 'locked'}`}>
              <span className="ach-lock-top" aria-hidden>
                {a.unlocked ? '🏆' : '🔒'}
              </span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <span className="ach-status">{a.unlocked ? 'Unlocked!' : `🔒 ${t('locked')}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
