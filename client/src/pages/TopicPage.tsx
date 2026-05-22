import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function TopicPage() {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { findTopic, loading } = useCurriculum();
  const found = findTopic(subject, sectionId, topicId);
  const base = `/subject/${subject}/${sectionId}/${topicId}`;

  if (loading) return <div className="page loading-screen">Loading...</div>;

  if (!found) {
    return (
      <div className="page">
        <p>Subtopic not found.</p>
        <Link to={`/subject/${subject}`}>Back</Link>
      </div>
    );
  }

  const { section, topic } = found;
  const hasVideo = !!topic.content.videoUrl;

  return (
    <div className={`page subject-detail-page ${found.subject.gradientClass}`}>
      <Link to={`/subject/${subject}`} className="back-btn light">
        ← {section.title}
      </Link>
      <header className="subject-hero">
        <span>{topic.icon}</span>
        <h1>{topic.name}</h1>
        <p>{topic.description}</p>
      </header>

      <div className="content-type-grid">
        <Link
          to={user ? `${base}/assignment` : '/login'}
          className="content-type-card assignment-card"
        >
          <span className="content-type-icon">📝</span>
          <h3>{t('assignments')}</h3>
          <p>{t('assignmentsDesc')}</p>
        </Link>

        <Link to={`${base}/video`} className={`content-type-card video-card ${!hasVideo ? 'muted-card' : ''}`}>
          <span className="content-type-icon">🎬</span>
          <h3>{t('videoExplanation')}</h3>
          <p>{hasVideo ? topic.content.videoTitle : t('videoComingSoon')}</p>
        </Link>

        <Link to={`${base}/lecture`} className="content-type-card lecture-card">
          <span className="content-type-icon">📖</span>
          <h3>{t('textLecture')}</h3>
          <p>{topic.content.lectureTitle}</p>
        </Link>
      </div>
    </div>
  );
}
