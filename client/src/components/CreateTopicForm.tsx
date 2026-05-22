import { useState, type FormEvent } from 'react';
import { api } from '../api';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';

type Props = {
  subjectId: string;
  onCreated?: () => void;
};

export function CreateTopicForm({ subjectId, onCreated }: Props) {
  const { t } = useLanguage();
  const { refresh } = useCurriculum();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📁');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError(t('topicTitleRequired'));
      return;
    }
    setLoading(true);
    try {
      await api.adminCreateTopic(subjectId, {
        title: title.trim(),
        description: description.trim(),
        icon: icon.trim() || '📁',
      });
      await refresh();
      setTitle('');
      setDescription('');
      setIcon('📁');
      setOpen(false);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('createTopicFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="btn btn-gradient admin-add-topic-btn" onClick={() => setOpen(true)}>
        ➕ {t('createTopic')}
      </button>
    );
  }

  return (
    <form className="card admin-create-form yellow-border" onSubmit={handleSubmit}>
      <h2>➕ {t('createTopic')}</h2>
      <label>
        {t('topicTitle')}
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        {t('topicDescription')}
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        {t('subjectIcon')}
        <input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={4} />
      </label>
      {error && <p className="error-msg">{error}</p>}
      <div className="admin-form-actions">
        <button type="submit" className="btn btn-gradient" disabled={loading}>
          {loading ? '...' : t('createTopic')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}
