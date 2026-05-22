import type { SubtopicContent } from '../types';
import { youtubeEmbedUrl } from './curriculumNormalize';

export function getSubtopicContentCounts(content: SubtopicContent) {
  const hasVideo =
    !!content.videoUrl?.trim() ||
    !!youtubeEmbedUrl(content.youtubeUrl) ||
    !!content.videoTitle?.trim();
  const hasLecture = (content.lectureParagraphs?.length ?? 0) > 0 || !!content.lectureTitle?.trim();
  const videoCount = (hasVideo ? 1 : 0) + (hasLecture ? 1 : 0);
  const exampleCount = content.examples?.length ?? 0;
  const exerciseCount = content.assignmentId?.trim() ? 1 : 0;
  const practiceCount = exerciseCount + (exampleCount > 0 ? 1 : 0);

  return {
    videoCount: Math.max(videoCount, hasVideo ? 1 : 0),
    exerciseCount: Math.max(practiceCount, exerciseCount),
  };
}
