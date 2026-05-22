import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function SubjectSectionsPage() {
  const { subject = 'math' } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { curriculum, loading } = useCurriculum();
  const data = curriculum[subject];

  if (loading) return <div className="page loading-screen">Loading...</div>;

  if (!data) {
    return (
      <div className="page">
        <p>Subject not found.</p>
        <Link to="/">Home</Link>
      </div>
    );
  }

  return (
    <div className={`page subject-detail-page ${data.gradientClass}`}>
      <Link to="/" className="back-btn light">
        ← {t('backHome')}
      </Link>
      <header className="subject-hero">
        <span>{data.icon}</span>
        <h1>{t(data.titleKey)}</h1>
        <p>{t('chooseSection')}</p>
      </header>

      <div className="sections-grid">
        {data.sections.map((section) => (
          <div key={section.id} className="card section-card yellow-border">
            <div className="section-card-header">
              <span className="section-folder-icon">📁</span>
              <div>
                <h2>
                  {section.icon} {section.title}
                </h2>
                <p className="topic-desc">{section.description}</p>
                <span className="section-label">{t('section')}</span>
              </div>
            </div>

            <p className="subtopics-label">{t('subtopics')}</p>
            <div className="topics-list">
              {section.topics.map((topic) => (
                <Link
                  key={topic.id}
                  to={user ? `/subject/${subject}/${section.id}/${topic.id}` : '/login'}
                  className="topic-row"
                >
                  <span className="lesson-icon">{topic.icon}</span>
                  <div>
                    <strong>{topic.name}</strong>
                    <p>{topic.description}</p>
                  </div>
                  <span className="topic-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
