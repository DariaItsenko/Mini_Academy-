import { Link, useParams } from 'react-router-dom';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';
import { getSubtopicContentCounts } from '../lib/subtopicMeta';
import { getSubjectTitle } from '../lib/subjectDisplay';
import type { Subtopic, Topic } from '../types';

function SubjectHeroIcon({ subject, icon }: { subject: string; icon: string }) {
  if (subject === 'math') {
    return (
      <span className="subject-hero-icon math-icon" aria-hidden>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
      </span>
    );
  }
  if (subject === 'english') {
    return <span className="subject-hero-icon emoji-icon" aria-hidden>📖</span>;
  }
  if (subject === 'ukrainian') {
    return <span className="subject-hero-icon emoji-icon" aria-hidden>🌍</span>;
  }
  return (
    <span className="subject-hero-icon emoji-icon" aria-hidden>
      {icon}
    </span>
  );
}

function LessonRow({
  subject,
  topic,
  subtopic,
  altStyle,
  t,
}: {
  subject: string;
  topic: Topic;
  subtopic: Subtopic;
  altStyle: boolean;
  t: (key: string) => string;
}) {
  const { videoCount, exerciseCount } = getSubtopicContentCounts(subtopic.content);
  const to = `/subject/${subject}/${topic.id}/${subtopic.id}`;

  return (
    <Link
      to={to}
      className={`lesson-block ${altStyle ? 'lesson-block-alt' : ''}`}
    >
      <span className="lesson-icon">{subtopic.icon}</span>
      <div className="lesson-text">
        <strong>{subtopic.name}</strong>
        <p>{subtopic.description}</p>
      </div>
      <div className="lesson-meta">
        <span className="lesson-book" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 4h7a3 3 0 0 1 3 3v13l-5-2.5L5 20V4zm9 0h5v16l-5-2.5V7a3 3 0 0 0-3-3z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </span>
        <div className="lesson-tags">
          {videoCount > 0 && (
            <span>
              {videoCount} {videoCount === 1 ? t('videoSingular') : t('videosPlural')}
            </span>
          )}
          {exerciseCount > 0 && (
            <span>
              {exerciseCount}{' '}
              {exerciseCount === 1 ? t('exerciseSingular') : t('exercisesPlural')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function SubjectTopicsPage() {
  const { subject = 'math' } = useParams();
  const { t } = useLanguage();
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
        <span aria-hidden>←</span> {t('backHome')}
      </Link>

      <header className="subject-hero">
        <SubjectHeroIcon subject={subject} icon={data.icon} />
        <h1>{getSubjectTitle(data, t)}</h1>
        <p>{t('chooseTopic')}</p>
      </header>

      <div className="topic-columns">
        {data.topics.map((topic) => (
          <div key={topic.id} className="card topic-category-card yellow-border">
            <div className="topic-category-header">
              <span className="topic-category-icon">{topic.icon}</span>
              <div>
                <h2>{topic.title}</h2>
                <p className="topic-desc">{topic.description}</p>
              </div>
            </div>
            <div className="topic-lessons">
              {topic.subtopics.map((st) => (
                <LessonRow
                  key={st.id}
                  subject={subject}
                  topic={topic}
                  subtopic={st}
                  altStyle={st.id === 'basic-shapes'}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
