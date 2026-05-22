import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';
import { curriculum as fallbackCurriculum } from '../data/curriculum';
import type { SubjectCurriculum } from '../types';
import { findSubtopicInCurriculum, normalizeCurriculum } from '../lib/curriculumNormalize';

interface CurriculumContextValue {
  curriculum: Record<string, SubjectCurriculum>;
  loading: boolean;
  refresh: () => Promise<void>;
  findSubtopic: (
    subjectId: string,
    topicId: string,
    subtopicId: string
  ) => ReturnType<typeof findSubtopicInCurriculum>;
}

const CurriculumContext = createContext<CurriculumContextValue | null>(null);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [curriculum, setCurriculum] = useState<Record<string, SubjectCurriculum>>({});
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { curriculum: c } = await api.getCurriculum();
      setCurriculum(normalizeCurriculum(c));
    } catch {
      setCurriculum(
        normalizeCurriculum(fallbackCurriculum as unknown as Record<string, SubjectCurriculum>)
      );
    }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const findSubtopic = (subjectId: string, topicId: string, subtopicId: string) =>
    findSubtopicInCurriculum(curriculum, subjectId, topicId, subtopicId);

  return (
    <CurriculumContext.Provider value={{ curriculum, loading, refresh, findSubtopic }}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const ctx = useContext(CurriculumContext);
  if (!ctx) throw new Error('useCurriculum must be used within CurriculumProvider');
  return ctx;
}

