import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const { curriculum, loading } = useCurriculum();
  const { t } = useLanguage();

  if (!user?.isAdmin) {
    return (
      <div className="page admin-page">
        <p>Admin access required.</p>
        <Link to="/admin-login">Admin Login</Link>
      </div>
    );
  }

  if (loading) return <div className="page loading-screen">Loading...</div>;

  return (
    <div className="page admin-page admin-wireframe">
      <div className="admin-nav">
        <Link to="/" className="back-btn">
          ← {t('backHome')}
        </Link>
        <button type="button" className="nav-btn logout-btn" onClick={() => logout()}>
          {t('logout')}
        </button>
      </div>

      <h1 className="admin-wireframe-title muted-title">{t('adminPanel')}</h1>

      <div className="wireframe-grid admin-subjects-grid">
        {Object.values(curriculum).map((subj) => (
          <Link key={subj.id} to={`/admin/subject/${subj.id}`} className="wireframe-card admin-wireframe-card">
            <span className="wireframe-card-title">
              {subj.icon} {t(subj.titleKey)}
            </span>
            <span className="wireframe-card-edit">{t('edit')}</span>
          </Link>
        ))}
      </div>

      <p className="wireframe-add-link">+ {t('addNewItem')}</p>

      <div className="admin-extra-links">
        <Link to="/admin/assignments" className="btn btn-gradient admin-link-card">
          📝 {t('assignmentBuilder')}
        </Link>
      </div>
    </div>
  );
}
