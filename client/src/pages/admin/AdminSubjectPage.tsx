import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSubjectPage() {
  const { subject = '' } = useParams();
  const { curriculum, loading } = useCurriculum();
  const { t } = useLanguage();
  const data = curriculum[subject];

  if (loading) return <div className="page loading-screen">Loading...</div>;
  if (!data) return <div className="page admin-page"><p>Subject not found</p></div>;

  return (
    <div className="page admin-page admin-wireframe">
      <Link to="/admin" className="back-btn">
        ← {t('adminPanel')}
      </Link>
      <h1 className="admin-wireframe-title">{t(data.titleKey)}</h1>

      <div className="wireframe-grid">
        {data.topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/admin/subject/${subject}/${topic.id}`}
            className="wireframe-card admin-wireframe-card"
          >
            <span className="wireframe-card-title">{topic.title}</span>
            <span className="wireframe-card-edit">{t('edit')}</span>
          </Link>
        ))}
      </div>

      <p className="wireframe-add-hint">{t('addTopicHint')}</p>
      <Link to="/admin/assignments" className="btn btn-secondary admin-side-link">
        {t('assignmentBuilder')}
      </Link>
    </div>
  );
}
