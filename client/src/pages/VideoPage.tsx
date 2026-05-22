import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';

export default function VideoPage() {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  const { t } = useLanguage();
  const { findTopic, loading } = useCurriculum();
  const found = findTopic(subject, sectionId, topicId);
  const topicPath = `/subject/${subject}/${sectionId}/${topicId}`;

  if (loading) return <div className="page loading-screen">Loading...</div>;
  if (!found) return null;

  const { topic } = found;
  const videoSrc = topic.content.videoUrl || '';

  return (
    <div className="page content-page">
      <Link to={topicPath} className="back-btn">
        ← {topic.name}
      </Link>
      <div className="card content-viewer yellow-border">
        <span className="content-badge video">🎬 {t('videoExplanation')}</span>
        <h1>{topic.content.videoTitle}</h1>
        {videoSrc ? (
          <video className="topic-video-player" controls src={videoSrc}>
            <track kind="captions" />
          </video>
        ) : (
          <div className="video-placeholder">
            <div className="video-play-icon">▶</div>
            <p>{topic.content.videoDescription}</p>
            <p className="video-note">{t('videoPlaceholder')}</p>
          </div>
        )}
        {videoSrc && <p className="video-desc">{topic.content.videoDescription}</p>}
        <Link to={topicPath} className="btn btn-gradient">
          {t('backToTopic')}
        </Link>
      </div>
    </div>
  );
}
