import { Link } from 'react-router-dom';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminCurriculumPage() {
  const { curriculum, loading } = useCurriculum();
  const { t } = useLanguage();

  if (loading) return <div className="page loading-screen">Loading...</div>;

  return (
    <div className="page admin-page">
      <Link to="/admin" className="back-btn">
        ← Admin Panel
      </Link>
      <h1 className="admin-page-title">📚 Curriculum Manager</h1>
      <p className="admin-hint">Select a subject → section → subtopic to edit video, lecture, and assignment.</p>

      {Object.values(curriculum).map((subject) => (
        <div key={subject.id} className="card admin-subject-block yellow-border">
          <h2>
            {subject.icon} {t(subject.titleKey)}
          </h2>
          {subject.sections.map((section) => (
            <div key={section.id} className="admin-section-block">
              <h3>
                📁 {section.title} <span className="section-label">{t('section')}</span>
              </h3>
              <p>{section.description}</p>
              <ul className="admin-topic-links">
                {section.topics.map((topic) => (
                  <li key={topic.id}>
                    <Link to={`/admin/curriculum/${subject.id}/${section.id}/${topic.id}`}>
                      {topic.icon} {topic.name} → Edit video, lecture & assignment
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
