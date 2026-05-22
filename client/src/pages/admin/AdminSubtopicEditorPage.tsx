import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api';
import { useCurriculum } from '../../context/CurriculumContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Subtopic, ExampleItem } from '../../types';

export default function AdminSubtopicEditorPage() {
  const { subject = '', topicId = '', subtopicId = '' } = useParams();
  const { findSubtopic, refresh } = useCurriculum();
  const { t } = useLanguage();
  const found = findSubtopic(subject, topicId, subtopicId);
  const [subtopic, setSubtopic] = useState<Subtopic | null>(null);
  const [exercises, setExercises] = useState<{ id: string; title: string }[]>([]);
  const [message, setMessage] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('video');

  useEffect(() => {
    if (found) setSubtopic(JSON.parse(JSON.stringify(found.subtopic)));
    api.adminGetExercises().then((r) => setExercises(r.exercises.map((e) => ({ id: e.id, title: e.title }))));
  }, [subject, topicId, subtopicId, found?.subtopic.name]);

  if (!found || !subtopic) {
    return (
      <div className="page admin-page">
        <p>Subtopic not found.</p>
        <Link to={`/admin/subject/${subject}`}>Back</Link>
      </div>
    );
  }

  const save = async () => {
    setMessage('');
    try {
      await api.adminUpdateSubtopic(subject, topicId, subtopicId, {
        content: subtopic.content,
        name: subtopic.name,
        description: subtopic.description,
      });
      await refresh();
      setMessage(t('saved'));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const uploadLocalVideo = async () => {
    if (!videoFile) {
      setMessage(t('chooseVideoFile'));
      return;
    }
    setMessage(t('uploading'));
    try {
      const res = await api.uploadVideo(subject, topicId, subtopicId, videoFile, {
        videoTitle: subtopic.content.videoTitle,
        videoDescription: subtopic.content.videoDescription,
      });
      setSubtopic({
        ...subtopic,
        content: { ...subtopic.content, videoUrl: res.videoUrl },
      });
      await refresh();
      setMessage(t('videoUploaded'));
      setVideoFile(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const updateExample = (index: number, field: keyof ExampleItem, value: string) => {
    const examples = [...(subtopic.content.examples || [])];
    examples[index] = { ...examples[index], [field]: value };
    setSubtopic({ ...subtopic, content: { ...subtopic.content, examples } });
  };

  const addExample = () => {
    const examples = [...(subtopic.content.examples || []), { title: 'Example', body: '' }];
    setSubtopic({ ...subtopic, content: { ...subtopic.content, examples } });
  };

  const removeExample = (index: number) => {
    const examples = (subtopic.content.examples || []).filter((_, i) => i !== index);
    setSubtopic({ ...subtopic, content: { ...subtopic.content, examples } });
  };

  return (
    <div className="page admin-page admin-page-color admin-subtopic-editor">
      <Link to={`/admin/subject/${subject}/${topicId}`} className="back-btn admin-back">
        ← {found.topic.title}
      </Link>
      <header className="admin-page-hero compact">
        <h1>{subtopic.icon} {subtopic.name}</h1>
      </header>
      {message && <p className="admin-msg">{message}</p>}

      <label className="admin-inline-label">
        {t('subtopicName')}
        <input value={subtopic.name} onChange={(e) => setSubtopic({ ...subtopic, name: e.target.value })} />
      </label>

      <div className="admin-stack-sections">
        <button
          type="button"
          className={`admin-stack-block ${openSection === 'video' ? 'open' : ''}`}
          onClick={() => setOpenSection(openSection === 'video' ? null : 'video')}
        >
          + {t('addVideo')}
        </button>
        {openSection === 'video' && (
          <div className="admin-stack-panel">
            <label>
              {t('videoTitle')}
              <input
                value={subtopic.content.videoTitle}
                onChange={(e) =>
                  setSubtopic({
                    ...subtopic,
                    content: { ...subtopic.content, videoTitle: e.target.value },
                  })
                }
              />
            </label>
            <label>
              {t('videoDescription')}
              <input
                value={subtopic.content.videoDescription}
                onChange={(e) =>
                  setSubtopic({
                    ...subtopic,
                    content: { ...subtopic.content, videoDescription: e.target.value },
                  })
                }
              />
            </label>
            <label>
              {t('youtubeUrl')}
              <input
                placeholder="https://www.youtube.com/watch?v=..."
                value={subtopic.content.youtubeUrl || ''}
                onChange={(e) =>
                  setSubtopic({
                    ...subtopic,
                    content: { ...subtopic.content, youtubeUrl: e.target.value },
                  })
                }
              />
            </label>
            <label>
              {t('uploadFromComputer')}
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            </label>
            {subtopic.content.videoUrl && (
              <p className="admin-video-current">
                {t('currentLocalVideo')}: {subtopic.content.videoUrl}
              </p>
            )}
            <div className="admin-stack-actions">
              <button type="button" className="btn btn-gradient" onClick={uploadLocalVideo}>
                {t('uploadVideo')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={save}>
                {t('saveYoutube')}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className={`admin-stack-block lecture ${openSection === 'lecture' ? 'open' : ''}`}
          onClick={() => setOpenSection(openSection === 'lecture' ? null : 'lecture')}
        >
          + {t('addLecture')}
        </button>
        {openSection === 'lecture' && (
          <div className="admin-stack-panel">
            <label>
              {t('lectureTitle')}
              <input
                value={subtopic.content.lectureTitle}
                onChange={(e) =>
                  setSubtopic({
                    ...subtopic,
                    content: { ...subtopic.content, lectureTitle: e.target.value },
                  })
                }
              />
            </label>
            <label>
              {t('lectureParagraphs')}
              <textarea
                rows={6}
                value={subtopic.content.lectureParagraphs.join('\n')}
                onChange={(e) =>
                  setSubtopic({
                    ...subtopic,
                    content: {
                      ...subtopic.content,
                      lectureParagraphs: e.target.value.split('\n').filter(Boolean),
                    },
                  })
                }
              />
            </label>
            <button type="button" className="btn btn-gradient" onClick={save}>
              {t('save')}
            </button>
          </div>
        )}

        <button
          type="button"
          className={`admin-stack-block examples ${openSection === 'examples' ? 'open' : ''}`}
          onClick={() => setOpenSection(openSection === 'examples' ? null : 'examples')}
        >
          + {t('addExamples')}
        </button>
        {openSection === 'examples' && (
          <div className="admin-stack-panel">
            {(subtopic.content.examples || []).map((ex, i) => (
              <div key={i} className="admin-example-row">
                <input
                  placeholder={t('exampleTitle')}
                  value={ex.title}
                  onChange={(e) => updateExample(i, 'title', e.target.value)}
                />
                <textarea
                  rows={3}
                  placeholder={t('exampleBody')}
                  value={ex.body}
                  onChange={(e) => updateExample(i, 'body', e.target.value)}
                />
                <button type="button" className="btn btn-secondary small" onClick={() => removeExample(i)}>
                  {t('remove')}
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addExample}>
              + {t('addExample')}
            </button>
            <button type="button" className="btn btn-gradient" onClick={save}>
              {t('save')}
            </button>
          </div>
        )}

        <button
          type="button"
          className={`admin-stack-block task ${openSection === 'task' ? 'open' : ''}`}
          onClick={() => setOpenSection(openSection === 'task' ? null : 'task')}
        >
          + {t('addTask')}
        </button>
        {openSection === 'task' && (
          <div className="admin-stack-panel">
            <label>
              {t('linkAssignment')}
              <select
                value={subtopic.content.assignmentId}
                onChange={(e) =>
                  setSubtopic({
                    ...subtopic,
                    content: { ...subtopic.content, assignmentId: e.target.value },
                  })
                }
              >
                <option value="">—</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.id})
                  </option>
                ))}
              </select>
            </label>
            <Link to="/admin/assignments" className="btn btn-secondary">
              {t('createAssignment')}
            </Link>
            <button type="button" className="btn btn-gradient" onClick={save}>
              {t('save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
