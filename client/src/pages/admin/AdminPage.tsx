import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminColorCard } from '../../components/AdminColorCard';
import { CreateSubjectForm } from '../../components/CreateSubjectForm';
import { getSubjectAdminClass, getSubjectTitle } from '../../lib/subjectDisplay';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { user } = useAuth();
  const { curriculum, loading } = useCurriculum();
  const { t } = useLanguage();
  const [showCreate, setShowCreate] = useState(false);

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
    <div className="page admin-page admin-page-color">
      <header className="admin-page-hero">
        <h1>🛡️ {t('adminPanel')}</h1>
        <p>{t('adminPreviewHint')}</p>
      </header>

      {!showCreate ? (
        <button
          type="button"
          className="btn btn-gradient admin-add-subject-btn"
          onClick={() => setShowCreate(true)}
        >
          ➕ {t('createSubject')}
        </button>
      ) : (
        <CreateSubjectForm onCreated={() => setShowCreate(false)} onCancel={() => setShowCreate(false)} />
      )}

      <div className="admin-color-grid">
        {Object.values(curriculum).map((subj) => (
          <AdminColorCard
            key={subj.id}
            to={`/admin/subject/${subj.id}`}
            title={getSubjectTitle(subj, t)}
            icon={subj.icon}
            subject={getSubjectAdminClass(subj)}
            actionLabel={t('edit')}
          />
        ))}
        <AdminColorCard
          to="/admin/assignments"
          title={t('assignmentBuilder')}
          icon="📝"
          subject="orange"
          actionLabel={t('edit')}
        />
      </div>
    </div>
  );
}
