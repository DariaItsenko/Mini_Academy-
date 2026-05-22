export const defaultSubtopicContent = () => ({
  videoUrl: '',
  youtubeUrl: '',
  videoTitle: '',
  videoDescription: '',
  lectureTitle: '',
  lectureParagraphs: [],
  examples: [],
  assignmentId: '',
});

export function normalizeCurriculum(curriculum) {
  const out = { ...curriculum };
  for (const subject of Object.values(out)) {
    if (subject.sections && !subject.topics) {
      subject.topics = subject.sections.map((sec) => ({
        id: sec.id,
        title: sec.title,
        description: sec.description || '',
        icon: sec.icon || '📁',
        subtopics: (sec.topics || []).map((st) => ({
          id: st.id,
          name: st.name,
          icon: st.icon || '•',
          description: st.description || '',
          content: {
            ...defaultSubtopicContent(),
            ...st.content,
            examples: st.content?.examples || [],
            youtubeUrl: st.content?.youtubeUrl || '',
          },
        })),
      }));
      delete subject.sections;
    }
    if (!subject.topics) subject.topics = [];
    for (const topic of subject.topics) {
      if (!topic.subtopics) topic.subtopics = [];
      for (const st of topic.subtopics) {
        st.content = { ...defaultSubtopicContent(), ...st.content };
        if (!st.content.examples) st.content.examples = [];
      }
    }
  }
  return out;
}

export function findSubtopic(curriculum, subjectId, topicId, subtopicId) {
  const subject = curriculum[subjectId];
  if (!subject) return null;
  const normalized = normalizeCurriculum({ [subjectId]: subject })[subjectId];
  const topic = normalized.topics.find((t) => t.id === topicId);
  if (!topic) return null;
  const subtopic = topic.subtopics.find((s) => s.id === subtopicId);
  if (!subtopic) return null;
  return { subject: normalized, topic, subtopic };
}

export function clearAssignmentIdFromCurriculum(curriculum, assignmentId) {
  if (!assignmentId) return curriculum;
  const out = normalizeCurriculum({ ...curriculum });
  for (const subject of Object.values(out)) {
    for (const topic of subject.topics || []) {
      for (const st of topic.subtopics || []) {
        if (st.content?.assignmentId === assignmentId) {
          st.content.assignmentId = '';
        }
      }
    }
  }
  return out;
}

export function renameAssignmentIdInCurriculum(curriculum, oldId, newId) {
  if (!oldId || !newId || oldId === newId) return curriculum;
  const out = normalizeCurriculum({ ...curriculum });
  for (const subject of Object.values(out)) {
    for (const topic of subject.topics || []) {
      for (const st of topic.subtopics || []) {
        if (st.content?.assignmentId === oldId) {
          st.content.assignmentId = newId;
        }
      }
    }
  }
  return out;
}

export function youtubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
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
