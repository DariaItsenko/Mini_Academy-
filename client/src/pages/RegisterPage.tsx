import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { AvatarCharacter } from '../components/AvatarCharacter';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Avatar } from '../types';

const defaultAvatar: Avatar = {
  skin: '#F5D0A9',
  hair: 'brown',
  hairStyle: 'short',
  top: 'default',
  bottom: 'default',
  shoes: 'default',
  accessory: 'none',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [age, setAge] = useState(7);
  const [grade, setGrade] = useState(1);
  const [characterGender, setCharacterGender] = useState<'boy' | 'girl'>('girl');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ username, password, email, parentEmail, age, grade, characterGender });
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <Header showNav={false} />
      <div className="auth-card">
        <div className="auth-icon">👤</div>
        <h1>{t('welcome')}</h1>
        <p className="auth-sub">{t('createAccount')}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Your name" />
          </label>
          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter email" />
          </label>
          <label>
            Parent Email
            <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Enter parent email" />
          </label>

          <div className="picker-group">
            <span>Age 🎂</span>
            <div className="picker-row">
              {[6, 7, 8, 9, 10].map((a) => (
                <button key={a} type="button" className={`picker-btn ${age === a ? 'active blue' : ''}`} onClick={() => setAge(a)}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="picker-group">
            <span>Select Grade</span>
            <div className="picker-row">
              {[1, 2, 3, 4, 5].map((g) => (
                <button key={g} type="button" className={`picker-btn ${grade === g ? 'active purple' : ''}`} onClick={() => setGrade(g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="character-picker">
            <span>Choose your character</span>
            <div className="character-options">
              <button
                type="button"
                className={`character-option ${characterGender === 'girl' ? 'selected' : ''}`}
                onClick={() => setCharacterGender('girl')}
              >
                <AvatarCharacter gender="girl" avatar={defaultAvatar} size={80} />
                <span>Girl</span>
              </button>
              <button
                type="button"
                className={`character-option ${characterGender === 'boy' ? 'selected' : ''}`}
                onClick={() => setCharacterGender('boy')}
              >
                <AvatarCharacter gender="boy" avatar={defaultAvatar} size={80} />
                <span>Boy</span>
              </button>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-gradient" disabled={loading}>
            {loading ? '...' : `➕ ${t('signUp')}`}
          </button>
        </form>

        <p className="auth-link">
          {t('haveAccount')} <Link to="/login">{t('login')}</Link>
        </p>
        <Link to="/admin-login" className="admin-link">
          🛡️ {t('adminLogin')}
        </Link>
      </div>
    </div>
  );
}
