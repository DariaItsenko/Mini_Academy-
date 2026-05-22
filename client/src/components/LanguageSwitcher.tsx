import { useLanguage } from '../context/LanguageContext';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      <span className="lang-globe" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.4a15.6 15.6 0 0 0-1.1-4.64A8.03 8.03 0 0 1 19.93 11zM12 4.07c.95 1.1 1.74 2.98 2.2 5.93H9.8c.46-2.95 1.25-4.83 2.2-5.93zM8.57 6.36A15.6 15.6 0 0 0 7.47 11H4.07a8.03 8.03 0 0 1 4.5-4.64zM4.07 13h3.4c.24 1.7.66 3.28 1.1 4.64A8.03 8.03 0 0 1 4.07 13zm5.5 6.57c-.95-1.1-1.74-2.98-2.2-5.93h4.4c-.46 2.95-1.25 4.83-2.2 5.93zM15.43 17.64c.44-1.36.86-2.94 1.1-4.64h3.4a8.03 8.03 0 0 1-4.5 4.64zM16.53 13h3.4a8.03 8.03 0 0 0-4.5-4.64c.44 1.36.86 2.94 1.1 4.64z"
            fill="currentColor"
          />
        </svg>
      </span>
      <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
        EN
      </button>
      <button type="button" className={lang === 'uk' ? 'active' : ''} onClick={() => setLang('uk')}>
        UK
      </button>
    </div>
  );
}
