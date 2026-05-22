import type { SubjectCurriculum } from '../types';

const BUILTIN_KEYS = new Set(['math', 'english', 'ukrainian']);

export function getSubjectTitle(
  subject: SubjectCurriculum,
  t: (key: string) => string
): string {
  if (subject.label?.trim()) return subject.label.trim();
  if (BUILTIN_KEYS.has(subject.titleKey)) return t(subject.titleKey);
  return subject.titleKey;
}

export const SUBJECT_THEMES = [
  { id: 'blue', label: 'Blue', gradientClass: 'math-bg', cardClass: 'math-card', adminClass: 'math' },
  { id: 'green', label: 'Green', gradientClass: 'english-bg', cardClass: 'english-card', adminClass: 'english' },
  { id: 'orange', label: 'Orange', gradientClass: 'ukrainian-bg', cardClass: 'ukrainian-card', adminClass: 'ukrainian' },
  { id: 'purple', label: 'Purple', gradientClass: 'purple-bg', cardClass: 'purple-card', adminClass: 'purple' },
  { id: 'pink', label: 'Pink', gradientClass: 'pink-bg', cardClass: 'pink-card', adminClass: 'pink' },
  { id: 'teal', label: 'Teal', gradientClass: 'teal-bg', cardClass: 'teal-card', adminClass: 'teal' },
] as const;

export type SubjectThemeId = (typeof SUBJECT_THEMES)[number]['id'];

export function themeById(themeId: string) {
  return SUBJECT_THEMES.find((t) => t.id === themeId) ?? SUBJECT_THEMES[3];
}

export function getSubjectCardClass(subject: SubjectCurriculum): string {
  if (subject.cardClass) return subject.cardClass;
  const theme = SUBJECT_THEMES.find((t) => t.gradientClass === subject.gradientClass);
  return theme?.cardClass ?? 'purple-card';
}

export function getSubjectAdminClass(subject: SubjectCurriculum): string {
  const theme = SUBJECT_THEMES.find(
    (t) => t.gradientClass === subject.gradientClass || t.cardClass === subject.cardClass
  );
  return theme?.adminClass ?? 'purple';
}

export function slugifySubjectId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}
