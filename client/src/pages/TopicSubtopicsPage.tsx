import { Navigate, useParams } from 'react-router-dom';

/** Legacy route — topics are listed on the subject page. */
export default function TopicSubtopicsPage() {
  const { subject = 'math' } = useParams();
  return <Navigate to={`/subject/${subject}`} replace />;
}
