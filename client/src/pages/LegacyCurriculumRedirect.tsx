import { Navigate, useParams } from 'react-router-dom';

/** Old URLs used sectionId + topicId; same IDs map to topicId + subtopicId */
export function LegacySubtopicRedirect() {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  return <Navigate to={`/subject/${subject}/${sectionId}/${topicId}`} replace />;
}

export function LegacySubtopicTabRedirect({ tab }: { tab?: string }) {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  const base = `/subject/${subject}/${sectionId}/${topicId}`;
  return <Navigate to={tab ? `${base}?tab=${tab}` : base} replace />;
}

export function LegacyAdminEditorRedirect() {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  return <Navigate to={`/admin/subject/${subject}/${sectionId}/${topicId}`} replace />;
}
