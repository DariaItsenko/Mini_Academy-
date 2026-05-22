import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminTopicPage() {
  const { subject = '', topicId = '' } = useParams();
  const { curriculum, loading } = useCurriculum();
  const { t } = useLanguage();
  const data = curriculum[subject];
  const topic = data?.topics.find((tp) => tp.id === topicId);

  if (loading) return <div className="page loading-screen">Loading...</div>;
  if (!data || !topic) return <div className="page admin-page"><p>Topic not found</p></div>;

  return (
    <div className="page admin-page admin-wireframe">
      <Link to={`/admin/subject/${subject}`} className="back-btn">
        ← {t(data.titleKey)}
      </Link>
      <h1 className="admin-wireframe-title">{topic.title}</h1>

      <div className="wireframe-grid">
        {topic.subtopics.map((st) => (
          <Link
            key={st.id}
            to={`/admin/subject/${subject}/${topicId}/${st.id}`}
            className="wireframe-card admin-wireframe-card"
          >
            <span className="wireframe-card-title">{st.name}</span>
            <span className="wireframe-card-edit">{t('edit')}</span>
          </Link>
        ))}
      </div>

      <p className="wireframe-add-hint">{t('addSubtopicHint')}</p>
    </div>
  );
}
