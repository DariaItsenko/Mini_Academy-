import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminColorCard } from '../../components/AdminColorCard';
import { CreateTopicForm } from '../../components/CreateTopicForm';
import { getSubjectAdminClass, getSubjectTitle } from '../../lib/subjectDisplay';

export default function AdminSubjectPage() {
  const { subject = '' } = useParams();
  const { curriculum, loading } = useCurriculum();
  const { t } = useLanguage();
  const data = curriculum[subject];

  if (loading) return <div className="page loading-screen">Loading...</div>;
  if (!data) return <div className="page admin-page"><p>Subject not found</p></div>;

  return (
    <div className="page admin-page admin-page-color">
      <Link to="/admin" className="back-btn admin-back">
        ← {t('adminPanel')}
      </Link>
      <header className="admin-page-hero">
        <h1>
          {data.icon} {getSubjectTitle(data, t)}
        </h1>
      </header>

      <CreateTopicForm subjectId={subject} />

      <div className="admin-color-grid">
        {data.topics.length === 0 ? (
          <p className="admin-empty-hint">{t('noTopicsYet')}</p>
        ) : (
          data.topics.map((topic) => (
            <AdminColorCard
              key={topic.id}
              to={`/admin/subject/${subject}/${topic.id}`}
              title={topic.title}
              subtitle={topic.description}
              subject={getSubjectAdminClass(data)}
              actionLabel={t('edit')}
            />
          ))
        )}
      </div>
    </div>
  );
}
