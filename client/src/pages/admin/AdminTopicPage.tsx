import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminColorCard } from '../../components/AdminColorCard';
import { getSubjectAdminClass, getSubjectTitle } from '../../lib/subjectDisplay';

export default function AdminTopicPage() {
  const { subject = '', topicId = '' } = useParams();
  const { curriculum, loading } = useCurriculum();
  const { t } = useLanguage();
  const data = curriculum[subject];
  const topic = data?.topics.find((tp) => tp.id === topicId);

  if (loading) return <div className="page loading-screen">Loading...</div>;
  if (!data || !topic) return <div className="page admin-page"><p>Topic not found</p></div>;

  return (
    <div className="page admin-page admin-page-color">
      <Link to={`/admin/subject/${subject}`} className="back-btn admin-back">
        ← {getSubjectTitle(data, t)}
      </Link>
      <header className="admin-page-hero">
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
      </header>

      <div className="admin-color-grid">
        {topic.subtopics.map((st) => (
          <AdminColorCard
            key={st.id}
            to={`/admin/subject/${subject}/${topicId}/${st.id}`}
            title={st.name}
            subtitle={st.description}
            icon={st.icon}
            subject={getSubjectAdminClass(data)}
            actionLabel={t('edit')}
          />
        ))}
      </div>
    </div>
  );
}
