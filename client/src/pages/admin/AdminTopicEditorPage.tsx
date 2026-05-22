import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api';
import { useCurriculum } from '../../context/CurriculumContext';
import type { Topic } from '../../types';

export default function AdminTopicEditorPage() {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  const { findTopic, refresh } = useCurriculum();
  const found = findTopic(subject, sectionId, topicId);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [exercises, setExercises] = useState<{ id: string; title: string }[]>([]);
  const [message, setMessage] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (found) setTopic(JSON.parse(JSON.stringify(found.topic)));
    api.adminGetExercises().then((r) => setExercises(r.exercises.map((e) => ({ id: e.id, title: e.title }))));
  }, [subject, sectionId, topicId, found?.topic.name]);

  if (!found || !topic) {
    return (
      <div className="page admin-page">
        <p>Subtopic not found.</p>
        <Link to="/admin/curriculum">Back</Link>
      </div>
    );
  }

  const saveLecture = async () => {
    setMessage('');
    try {
      await api.adminUpdateTopic(subject, sectionId, topicId, {
        content: topic.content,
        name: topic.name,
        description: topic.description,
      });
      await refresh();
      setMessage('Lecture & details saved!');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      setMessage('Choose a video file first');
      return;
    }
    setMessage('Uploading...');
    try {
      const res = await api.uploadVideo(subject, sectionId, topicId, videoFile, {
        videoTitle: topic.content.videoTitle,
        videoDescription: topic.content.videoDescription,
      });
      setTopic({
        ...topic,
        content: { ...topic.content, videoUrl: res.videoUrl },
      });
      await refresh();
      setMessage('Video uploaded!');
      setVideoFile(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  return (
    <div className="page admin-page">
      <Link to="/admin/curriculum" className="back-btn">
        ← Curriculum
      </Link>
      <h1 className="admin-page-title">
        {topic.icon} {topic.name}
      </h1>
      <p className="admin-hint">
        Section: {found.section.title} · Subject: {found.subject.titleKey}
      </p>

      {message && <p className="admin-msg">{message}</p>}

      <div className="card admin-editor purple-border">
        <h2>📖 Text Lecture</h2>
        <label>
          Subtopic name
          <input value={topic.name} onChange={(e) => setTopic({ ...topic, name: e.target.value })} />
        </label>
        <label>
          Lecture title
          <input
            value={topic.content.lectureTitle}
            onChange={(e) =>
              setTopic({
                ...topic,
                content: { ...topic.content, lectureTitle: e.target.value },
              })
            }
          />
        </label>
        <label>
          Lecture paragraphs (one per line)
          <textarea
            rows={6}
            value={topic.content.lectureParagraphs.join('\n')}
            onChange={(e) =>
              setTopic({
                ...topic,
                content: {
                  ...topic.content,
                  lectureParagraphs: e.target.value.split('\n').filter(Boolean),
                },
              })
            }
          />
        </label>
      </div>

      <div className="card admin-editor yellow-border">
        <h2>🎬 Video</h2>
        <label>
          Video title
          <input
            value={topic.content.videoTitle}
            onChange={(e) =>
              setTopic({
                ...topic,
                content: { ...topic.content, videoTitle: e.target.value },
              })
            }
          />
        </label>
        <label>
          Video description
          <input
            value={topic.content.videoDescription}
            onChange={(e) =>
              setTopic({
                ...topic,
                content: { ...topic.content, videoDescription: e.target.value },
              })
            }
          />
        </label>
        {topic.content.videoUrl && (
          <p className="admin-video-current">
            Current video: <a href={topic.content.videoUrl}>{topic.content.videoUrl}</a>
          </p>
        )}
        <label>
          Upload video (MP4, WebM)
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
        </label>
        <button type="button" className="btn btn-gradient" onClick={uploadVideo}>
          Upload Video
        </button>
      </div>

      <div className="card admin-editor">
        <h2>📝 Assignment</h2>
        <label>
          Link assignment
          <select
            value={topic.content.assignmentId}
            onChange={(e) =>
              setTopic({
                ...topic,
                content: { ...topic.content, assignmentId: e.target.value },
              })
            }
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({ex.id})
              </option>
            ))}
          </select>
        </label>
        <Link to="/admin/assignments" className="btn btn-secondary">
          + Create new assignment
        </Link>
      </div>

      <button type="button" className="btn btn-gradient" onClick={saveLecture}>
        💾 Save lecture & subtopic info
      </button>
    </div>
  );
}
