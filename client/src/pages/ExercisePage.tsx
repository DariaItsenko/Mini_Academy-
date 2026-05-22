import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import type { ExerciseFull } from '../types';

export default function ExercisePage() {
  const { id = '' } = useParams();
  const { user, setUser } = useAuth();
  const [content, setContent] = useState<ExerciseFull | null>(null);
  const [loadError, setLoadError] = useState('');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [pointsMsg, setPointsMsg] = useState('');

  useEffect(() => {
    api
      .getExercise(id)
      .then((r) => setContent(r.exercise))
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Failed to load'));
  }, [id]);

  if (loadError) {
    return (
      <div className="page exercise-page">
        <p>{loadError}</p>
        <Link to="/">Home</Link>
      </div>
    );
  }

  if (!content) return <div className="page loading-screen">Loading...</div>;

  const question = content.questions[step];

  const handleAnswer = (idx: number) => {
    const correct = idx === question.answer;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    if (step + 1 < content.questions.length) {
      setStep(step + 1);
    } else {
      finish(newScore);
    }
  };

  const finish = async (finalScore: number) => {
    setDone(true);
    if (finalScore >= Math.ceil(content.questions.length / 2)) {
      try {
        const res = await api.completeExercise(id);
        setUser(res.user);
        setPointsMsg(res.alreadyCompleted ? 'Already completed!' : `+${res.pointsEarned} points earned! ⭐`);
      } catch {
        setPointsMsg('Could not save progress');
      }
    } else {
      setPointsMsg('Try again to earn points!');
    }
  };

  const completed = user?.completedExercises.includes(id);

  return (
    <div className="page exercise-page">
      <Link to="/" className="back-btn">
        ← Back
      </Link>
      <div className="card exercise-card">
        <h1>{content.title}</h1>
        {completed && !done && <p className="completed-badge">✅ Already completed</p>}

        {!done ? (
          <>
            <p className="exercise-progress">
              Question {step + 1} of {content.questions.length}
            </p>
            <h2 className="question">{question.q}</h2>
            <div className="options-grid">
              {question.options.map((opt, i) => (
                <button key={opt} type="button" className="option-btn" onClick={() => handleAnswer(i)}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="exercise-result">
            <h2>🎉 Assignment Complete!</h2>
            <p>
              Score: {score}/{content.questions.length}
            </p>
            <p className="points-earned">{pointsMsg}</p>
            <Link to="/profile" className="btn btn-gradient">
              View Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
