import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import type { ExerciseFull, ExerciseQuestion } from '../../types';

const emptyQuestion = (): ExerciseQuestion => ({ q: '', options: ['', '', ''], answer: 0 });

export default function AdminAssignmentsPage() {
  const [list, setList] = useState<ExerciseFull[]>([]);
  const [editing, setEditing] = useState<ExerciseFull | null>(null);
  const [editingOriginalId, setEditingOriginalId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.adminGetExercises().then((r) => setList(r.exercises)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditingOriginalId(null);
    setEditing({
      id: `exercise-${Date.now()}`,
      subject: 'math',
      title: '',
      points: 15,
      questions: [emptyQuestion()],
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.id?.trim()) {
      setMessage('Assignment ID is required');
      return;
    }
    setMessage('');
    try {
      const exists = editingOriginalId
        ? list.some((e) => e.id === editingOriginalId)
        : list.some((e) => e.id === editing.id);
      if (exists) await api.adminUpdateExercise(editingOriginalId || editing.id, editing);
      else await api.adminCreateExercise(editing);
      setMessage('Saved!');
      setEditing(null);
      setEditingOriginalId(null);
      load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this assignment?')) return;
    await api.adminDeleteExercise(id);
    load();
  };

  if (loading) return <div className="page loading-screen">Loading...</div>;

  return (
    <div className="page admin-page">
      <Link to="/admin" className="back-btn">
        ← Admin Panel
      </Link>
      <h1 className="admin-page-title">📝 Assignment Builder</h1>

      <button type="button" className="btn btn-gradient" onClick={startNew}>
        + Create New Assignment
      </button>

      {message && <p className="admin-msg">{message}</p>}

      {editing && (
        <div className="card admin-editor yellow-border">
          <h2>{list.some((e) => e.id === editing.id) ? 'Edit' : 'New'} Assignment</h2>
          <div className="admin-form-grid">
            <label>
              ID
              <input
                value={editing.id}
                onChange={(e) => setEditing({ ...editing, id: e.target.value })}
              />
              {editingOriginalId && editing.id !== editingOriginalId && (
                <span className="admin-hint">Changing the ID updates links in all subtopics that use this assignment.</span>
              )}
            </label>
            <label>
              Subject
              <select value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })}>
                <option value="math">Math</option>
                <option value="english">English</option>
                <option value="ukrainian">Ukrainian</option>
              </select>
            </label>
            <label>
              Title
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </label>
            <label>
              Points
              <input
                type="number"
                value={editing.points}
                onChange={(e) => setEditing({ ...editing, points: Number(e.target.value) })}
              />
            </label>
          </div>

          <h3>Questions</h3>
          {editing.questions.map((q, qi) => (
            <div key={qi} className="question-editor">
              <input
                placeholder="Question text"
                value={q.q}
                onChange={(e) => {
                  const questions = [...editing.questions];
                  questions[qi] = { ...q, q: e.target.value };
                  setEditing({ ...editing, questions });
                }}
              />
              {q.options.map((opt, oi) => (
                <div key={oi} className="option-row">
                  <input
                    value={opt}
                    onChange={(e) => {
                      const questions = [...editing.questions];
                      const options = [...q.options];
                      options[oi] = e.target.value;
                      questions[qi] = { ...q, options };
                      setEditing({ ...editing, questions });
                    }}
                  />
                  <label>
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.answer === oi}
                      onChange={() => {
                        const questions = [...editing.questions];
                        questions[qi] = { ...q, answer: oi };
                        setEditing({ ...editing, questions });
                      }}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditing({ ...editing, questions: [...editing.questions, emptyQuestion()] })}
          >
            + Add Question
          </button>

          <div className="admin-form-actions">
            <button type="button" className="btn btn-gradient" onClick={save}>
              💾 Save Assignment
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {list.map((ex) => (
          <div key={ex.id} className="admin-list-item">
            <div>
              <strong>{ex.title}</strong>
              <span>
                {ex.subject} · {ex.questions.length} questions · ⭐ {ex.points}
              </span>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditingOriginalId(ex.id);
                  setEditing({ ...ex });
                }}
              >
                Edit
              </button>
              <button type="button" className="btn btn-sm logout-btn" onClick={() => remove(ex.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
