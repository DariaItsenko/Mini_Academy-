import { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { youtubeEmbedUrl } from '../lib/curriculumNormalize';
import { getSubjectTitle } from '../lib/subjectDisplay';

type Tab = 'video' | 'lecture' | 'examples' | 'assignments';

const TAB_ORDER: Tab[] = ['video', 'lecture', 'examples', 'assignments'];

export default function SubtopicPage() {
  const { subject = '', topicId = '', subtopicId = '' } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { findSubtopic, loading } = useCurriculum();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'video';
  const [tab, setTab] = useState<Tab>(
    TAB_ORDER.includes(initialTab) ? initialTab : 'video'
  );
  const found = findSubtopic(subject, topicId, subtopicId);
  const [exerciseIds, setExerciseIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.getExercises().then((r) => setExerciseIds(new Set(r.exercises.map((e) => e.id)))).catch(() => {});
  }, []);

  const assignmentMissing = useMemo(() => {
    const aid = found?.subtopic.content.assignmentId;
    return !!aid && !exerciseIds.has(aid);
  }, [found, exerciseIds]);

  useEffect(() => {
    const q = searchParams.get('tab') as Tab;
    if (q && TAB_ORDER.includes(q)) setTab(q);
  }, [searchParams]);

  const selectTab = (next: Tab) => {
    setTab(next);
    setSearchParams({ tab: next }, { replace: true });
  };

  const backTo = `/subject/${subject}`;

  if (loading) return <div className="page loading-screen">Loading...</div>;

  if (!found) {
    return (
      <div className="page">
        <p>Subtopic not found.</p>
        <Link to={`/subject/${subject}`}>Back</Link>
      </div>
    );
  }

  const { subject: subj, topic, subtopic } = found;
  const content = subtopic.content;
  const embed = youtubeEmbedUrl(content.youtubeUrl);
  const hasLocalVideo = !!content.videoUrl;
  const hasVideo = hasLocalVideo || !!embed;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'video', label: t('tabVideo') },
    { id: 'lecture', label: t('tabLecture') },
    { id: 'examples', label: t('tabExamples') },
    { id: 'assignments', label: t('tabProblems') },
  ];

  return (
    <div className={`page subject-detail-page subtopic-detail-page ${subj.gradientClass}`}>
      <Link to={backTo} className="back-btn light">
        <span aria-hidden>←</span> {getSubjectTitle(subj, t)}
      </Link>

      <header className="subject-hero compact-hero">
        <span className="subtopic-hero-icon">{subtopic.icon}</span>
        <h1>{subtopic.name}</h1>
        <p>{subtopic.description}</p>
      </header>

      <div className="subtopic-tabs-wrap">
        <div className="subtopic-tabs" role="tablist" aria-label="Lesson content">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`subtopic-tab ${tab === item.id ? 'active' : ''}`}
              onClick={() => selectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card content-viewer yellow-border subtopic-tab-panel" role="tabpanel">
        {tab === 'video' && (
          <>
            <h2>{content.videoTitle || t('videoExplanation')}</h2>
            {embed ? (
              <div className="video-embed-wrap">
                <iframe
                  title={content.videoTitle}
                  src={embed}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : hasLocalVideo ? (
              <video className="topic-video-player" controls src={content.videoUrl}>
                <track kind="captions" />
              </video>
            ) : (
              <div className="video-placeholder">
                <div className="video-play-icon">▶</div>
                <p>{content.videoDescription || t('videoPlaceholder')}</p>
              </div>
            )}
            {(content.videoDescription || embed || hasLocalVideo) && (
              <p className="video-desc">{content.videoDescription}</p>
            )}
          </>
        )}

        {tab === 'lecture' && (
          <>
            <h2>{content.lectureTitle || t('textLecture')}</h2>
            {content.lectureParagraphs?.length ? (
              content.lectureParagraphs.map((p, i) => (
                <p key={i} className="lecture-para">
                  {p}
                </p>
              ))
            ) : (
              <p className="muted-text">{t('lectureEmpty')}</p>
            )}
          </>
        )}

        {tab === 'examples' && (
          <>
            <h2>{t('tabExamples')}</h2>
            <p className="examples-intro">{t('examplesIntro')}</p>
            {content.examples?.length ? (
              <ul className="examples-list">
                {content.examples.map((ex, i) => (
                  <li key={i} className="example-item">
                    <strong>{ex.title}</strong>
                    <p>{ex.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">{t('examplesEmpty')}</p>
            )}
          </>
        )}

        {tab === 'assignments' && (
          <>
            <h2>{t('tabProblems')}</h2>
            <p>{t('problemsDesc')}</p>
            {content.assignmentId && assignmentMissing ? (
              <p className="muted-text">{t('assignmentDeleted')}</p>
            ) : content.assignmentId ? (
              <button
                type="button"
                className="btn btn-gradient"
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  navigate(`/exercise/${content.assignmentId}`);
                }}
              >
                {t('startAssignment')} →
              </button>
            ) : (
              <p className="muted-text">{t('assignmentEmpty')}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
