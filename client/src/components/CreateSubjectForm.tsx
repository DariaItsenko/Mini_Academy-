import { useState, type FormEvent } from 'react';
import { api } from '../api';
import { useCurriculum } from '../context/CurriculumContext';
import { useLanguage } from '../context/LanguageContext';
import { SUBJECT_THEMES, slugifySubjectId, type SubjectThemeId } from '../lib/subjectDisplay';

type Props = {
  onCreated?: () => void;
  onCancel?: () => void;
};

export function CreateSubjectForm({ onCreated, onCancel }: Props) {
  const { t } = useLanguage();
  const { refresh } = useCurriculum();
  const [label, setLabel] = useState('');
  const [customId, setCustomId] = useState('');
  const [icon, setIcon] = useState('📚');
  const [theme, setTheme] = useState<SubjectThemeId>('purple');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const previewId = slugifySubjectId(customId || label) || 'new-subject';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!label.trim()) {
      setError(t('subjectNameRequired'));
      return;
    }
    setLoading(true);
    try {
      await api.adminCreateSubject({
        label: label.trim(),
        id: customId.trim() || undefined,
        icon: icon.trim() || '📚',
        theme,
      });
      await refresh();
      setLabel('');
      setCustomId('');
      setIcon('📚');
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('createSubjectFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card admin-create-form yellow-border" onSubmit={handleSubmit}>
      <h2>➕ {t('createSubject')}</h2>
      <label>
        {t('subjectName')}
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t('subjectNamePlaceholder')}
          required
        />
      </label>
      <label>
        {t('subjectIdOptional')}
        <input
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
          placeholder={previewId}
        />
        <span className="field-hint">
          {t('subjectIdHint')}: <code>{previewId}</code>
        </span>
      </label>
      <label>
        {t('subjectIcon')}
        <input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={4} />
      </label>
      <label>
        {t('subjectColor')}
        <div className="theme-picker-row">
          {SUBJECT_THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              className={`theme-swatch ${th.adminClass} ${theme === th.id ? 'active' : ''}`}
              onClick={() => setTheme(th.id)}
              title={th.label}
            />
          ))}
        </div>
      </label>
      {error && <p className="error-msg">{error}</p>}
      <div className="admin-form-actions">
        <button type="submit" className="btn btn-gradient" disabled={loading}>
          {loading ? '...' : t('createSubject')}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {t('cancel')}
          </button>
        )}
      </div>
    </form>
  );
}
