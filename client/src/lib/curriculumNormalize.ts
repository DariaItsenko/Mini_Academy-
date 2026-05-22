import type { SubjectCurriculum, Topic, Subtopic, SubtopicContent } from '../types';

const defaultContent = (): SubtopicContent => ({
  assignmentId: '',
  videoUrl: '',
  youtubeUrl: '',
  videoTitle: '',
  videoDescription: '',
  lectureTitle: '',
  lectureParagraphs: [],
  examples: [],
});

export function normalizeSubject(subject: SubjectCurriculum): SubjectCurriculum {
  if (subject.topics?.length) {
    return {
      ...subject,
      topics: subject.topics.map((topic) => ({
        ...topic,
        subtopics: (topic.subtopics || []).map((st) => ({
          ...st,
          content: { ...defaultContent(), ...st.content, examples: st.content?.examples || [] },
        })),
      })),
    };
  }
  if (!subject.sections?.length) return { ...subject, topics: [] };
  return {
    ...subject,
    topics: subject.sections.map((sec) => ({
      id: sec.id,
      title: sec.title,
      description: sec.description || '',
      icon: sec.icon || '📁',
      subtopics: (sec.topics || []).map((st) => ({
        id: st.id,
        name: st.name,
        icon: st.icon || '•',
        description: st.description || '',
        content: { ...defaultContent(), ...st.content, examples: st.content?.examples || [] },
      })),
    })),
  };
}

export function normalizeCurriculum(
  curriculum: Record<string, SubjectCurriculum>
): Record<string, SubjectCurriculum> {
  const out: Record<string, SubjectCurriculum> = {};
  for (const [key, subject] of Object.entries(curriculum)) {
    out[key] = normalizeSubject(subject);
  }
  return out;
}

export function youtubeEmbedUrl(url?: string): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s&]+)/,
    /youtube\.com\/embed\/([^?\s&]+)/,
    /youtube\.com\/shorts\/([^?\s&]+)/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

export type SubtopicFound = {
  subject: SubjectCurriculum;
  topic: Topic;
  subtopic: Subtopic;
};

export function findSubtopicInCurriculum(
  curriculum: Record<string, SubjectCurriculum>,
  subjectId: string,
  topicId: string,
  subtopicId: string
): SubtopicFound | null {
  const subject = curriculum[subjectId];
  if (!subject) return null;
  const normalized = normalizeSubject(subject);
  const topic = normalized.topics.find((t) => t.id === topicId);
  if (!topic) return null;
  const subtopic = topic.subtopics.find((s) => s.id === subtopicId);
  if (!subtopic) return null;
  return { subject: normalized, topic, subtopic };
}
