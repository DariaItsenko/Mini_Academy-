import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function StatisticsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const progress = user.stats.maxLevels
    ? Math.round((user.stats.totalLevels / user.stats.maxLevels) * 100)
    : 0;

  const subjectData = [
    { name: 'Math', value: user.completedExercises.filter((id) => id.includes('math')).length },
    { name: 'English', value: user.completedExercises.filter((id) => id.includes('english')).length },
    {
      name: 'Ukrainian',
      value: user.completedExercises.filter((id) => id.includes('ukrainian')).length,
    },
  ];

  const bannerClass = progress >= 50 ? 'good' : progress >= 20 ? 'ok' : 'needs-effort';
  const bannerText =
    progress >= 50
      ? { title: 'Great Progress!', sub: 'Keep up the amazing work!' }
      : progress >= 20
        ? { title: 'Good Start!', sub: 'You are on the right track. Keep practicing!' }
        : { title: 'Needs More Effort', sub: "Don't give up! Regular practice will help you succeed." };

  return (
    <div className="page stats-page">
      <Link to="/" className="back-btn">
        <span aria-hidden>←</span> {t('backHome')}
      </Link>

      <div className="card stats-header-card blue-border">
        <div className="stats-header">
          <div className="stats-header-left">
            <span className="stats-icon-square" aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7 3h4v11h-4V10z"
                  fill="white"
                />
              </svg>
            </span>
            <div>
              <h1>{user.username}&apos;s Statistics</h1>
              <p className="stats-subtitle">
                Grade {user.grade} • Detailed Progress Analysis
              </p>
            </div>
          </div>
          <div className="overall-progress">
            <span className="overall-label">Overall Progress</span>
            <strong>{progress}%</strong>
          </div>
        </div>
      </div>

      <div className={`motivation-banner ${bannerClass}`}>
        <span className="banner-icon-circle" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 18l6-8 4 5 6-9"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <strong>{bannerText.title}</strong>
          <p>{bannerText.sub}</p>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-card blue">
          <span className="metric-icon blue" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </span>
          <div className="metric-text">
            <span className="metric-label">Levels</span>
            <span className="metric-value">
              {user.stats.totalLevels}/{user.stats.maxLevels}
            </span>
          </div>
        </div>
        <div className="metric-card yellow">
          <span className="metric-icon yellow" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 18.2l.9-5.5-4-3.9 5.5-.8L12 3z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="metric-text">
            <span className="metric-label">Stars</span>
            <span className="metric-value">
              {user.stars}/{user.stats.maxStars}
            </span>
          </div>
        </div>
        <div className="metric-card green">
          <span className="metric-icon green" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 16l4-6 4 4 4-8 4 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="metric-text">
            <span className="metric-label">Accuracy</span>
            <span className="metric-value">{user.stats.accuracy}%</span>
          </div>
        </div>
        <div className="metric-card purple">
          <span className="metric-icon purple" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <div className="metric-text">
            <span className="metric-label">Streak</span>
            <span className="metric-value">
              {user.streak} 🔥
            </span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card purple-border">
          <h3>
            <span className="chart-title-icon purple" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7 3h4v11h-4V10z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Subject Comparison
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <YAxis
                allowDecimals={false}
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card yellow-border">
          <h3>
            <span className="chart-title-icon yellow" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 18.2l.9-5.5-4-3.9 5.5-.8L12 3z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Stars Distribution
          </h3>
          <div className="chart-placeholder" aria-label="Stars distribution chart placeholder" />
        </div>
      </div>
    </div>
  );
}
