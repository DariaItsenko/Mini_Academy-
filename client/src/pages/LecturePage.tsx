import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';

export default function LecturePage() {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  const { t } = useLanguage();
  const { findTopic, loading } = useCurriculum();
  const found = findTopic(subject, sectionId, topicId);
  const topicPath = `/subject/${subject}/${sectionId}/${topicId}`;

  if (loading) return <div className="page loading-screen">Loading...</div>;
  if (!found) return null;

  const { topic } = found;

  return (
    <div className="page content-page">
      <Link to={topicPath} className="back-btn">
        ← {topic.name}
      </Link>
      <div className="card content-viewer purple-border">
        <span className="content-badge lecture">📖 {t('textLecture')}</span>
        <h1>{topic.content.lectureTitle}</h1>
        <div className="lecture-body">
          {topic.content.lectureParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Link to={topicPath} className="btn btn-gradient">
          {t('backToTopic')}
        </Link>
      </div>
    </div>
  );
}
