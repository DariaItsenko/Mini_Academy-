import { Navigate, useParams } from 'react-router-dom';
import { findTopic } from '../data/curriculum';

export default function AssignmentRedirectPage() {
  const { subject = '', sectionId = '', topicId = '' } = useParams();
  const found = findTopic(subject, sectionId, topicId);

  if (!found) return <Navigate to="/" replace />;

  return <Navigate to={`/exercise/${found.topic.content.assignmentId}`} replace />;
}
